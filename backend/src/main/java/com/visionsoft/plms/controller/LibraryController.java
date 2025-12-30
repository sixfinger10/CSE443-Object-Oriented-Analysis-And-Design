package com.visionsoft.plms.controller;

import com.visionsoft.plms.dto.auth.LibraryItemDTO;
import com.visionsoft.plms.service.ImportExportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/library")
@CrossOrigin(origins = "*")
public class LibraryController {
    
    @Autowired
    private ImportExportService importExportService;
    
    // Export library as JSON - Database'den çek
    @GetMapping("/export/{userId}/json")
    public ResponseEntity<String> exportLibraryAsJson(@PathVariable Long userId) {
        
        try {
            String json = importExportService.exportLibraryAsJson(userId);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setContentDispositionFormData("attachment", "library_" + userId + ".json");
            
            return new ResponseEntity<>(json, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    // Export library as CSV - Database'den çek
    @GetMapping("/export/{userId}/csv")
    public ResponseEntity<String> exportLibraryAsCsv(@PathVariable Long userId) {
        
        try {
            String csv = importExportService.exportLibraryAsCsv(userId);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(new MediaType("text", "csv", StandardCharsets.UTF_8));
            headers.setContentDispositionFormData("attachment", "library_" + userId + ".csv");
            
            return new ResponseEntity<>(csv, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }
    
    // Import library from JSON file
    @PostMapping("/import/{userId}/json")
    public ResponseEntity<Map<String, Object>> importLibraryFromJson(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String jsonData = new String(file.getBytes(), StandardCharsets.UTF_8);
            List<LibraryItemDTO> items = importExportService.importLibraryFromJson(userId, jsonData);
            
            response.put("success", true);
            response.put("message", "Import successful");
            response.put("itemsCount", items.size());
            response.put("items", items);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Import failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    // Sync library (for offline sync)
    @PostMapping("/sync/{userId}")
    public ResponseEntity<Map<String, Object>> syncLibrary(
            @PathVariable Long userId,
            @RequestBody List<ImportExportService.SyncOperation> operations) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            ImportExportService.SyncResult result = importExportService.syncLibrary(userId, operations);
            
            response.put("success", result.isSuccess());
            response.put("message", result.getMessage());
            response.put("added", result.getAdded());
            response.put("updated", result.getUpdated());
            response.put("deleted", result.getDeleted());
            response.put("errors", result.getErrors());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Sync failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Health check
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Library API is running");
        return ResponseEntity.ok(response);
    }
}