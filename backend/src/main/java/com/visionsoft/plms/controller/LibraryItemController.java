package com.visionsoft.plms.controller;

import com.visionsoft.plms.entity.LibraryItem;
import com.visionsoft.plms.repository.LibraryItemRepository;
import com.visionsoft.plms.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class LibraryItemController {

    private final LibraryItemRepository libraryItemRepository;
    private final JwtUtil jwtUtil;

    public LibraryItemController(LibraryItemRepository libraryItemRepository, JwtUtil jwtUtil) {
        this.libraryItemRepository = libraryItemRepository;
        this.jwtUtil = jwtUtil;
    }

    private Long getUserIdFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("No authorization token found");
        }
        String token = authHeader.substring(7);
        Long userId = jwtUtil.extractUserId(token);
        if (userId == null) {
            throw new RuntimeException("Invalid token");
        }
        return userId;
    }

    @Transactional
    @PatchMapping("/{id}/favorite")
    public ResponseEntity<LibraryItem> toggleFavorite(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        try {
            System.out.println("===========================================");
            System.out.println("DEBUG: Toggle favorite called for item ID: " + id);

            Long userId = getUserIdFromToken(authHeader);
            System.out.println("DEBUG: User ID from token: " + userId);

            LibraryItem item = libraryItemRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Item not found with ID: " + id));

            System.out.println("DEBUG: Item found - Title: " + item.getTitle());
            System.out.println("DEBUG: Item owner ID: " + item.getUser().getId());
            System.out.println("DEBUG: BEFORE - favorite status: " + item.isFavorite());

            if (!item.getUser().getId().equals(userId)) {
                System.err.println("ERROR: User " + userId + " tried to access item owned by " + item.getUser().getId());
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            boolean newFavoriteStatus = !item.isFavorite();
            item.setFavorite(newFavoriteStatus);

            System.out.println("DEBUG: Setting favorite to: " + newFavoriteStatus);

            LibraryItem updatedItem = libraryItemRepository.save(item);

            System.out.println("DEBUG: AFTER SAVE - favorite status: " + updatedItem.isFavorite());
            System.out.println("SUCCESS: Favorite toggled for item: " + id);
            System.out.println("===========================================");

            return ResponseEntity.ok(updatedItem);

        } catch (RuntimeException e) {
            System.err.println("ERROR in toggleFavorite (Runtime): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            System.err.println("ERROR in toggleFavorite (General): " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        try {
            System.out.println("DEBUG: Delete item called for ID: " + id);

            Long userId = getUserIdFromToken(authHeader);
            System.out.println("DEBUG: User ID from token: " + userId);

            LibraryItem item = libraryItemRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Item not found with ID: " + id));

            System.out.println("DEBUG: Item found - Title: " + item.getTitle());

            if (!item.getUser().getId().equals(userId)) {
                System.err.println("ERROR: User " + userId + " tried to delete item owned by " + item.getUser().getId());
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            libraryItemRepository.delete(item);

            System.out.println("SUCCESS: Item deleted: " + id);

            return ResponseEntity.ok().build();

        } catch (RuntimeException e) {
            System.err.println("ERROR in deleteItem: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            System.err.println("ERROR in deleteItem: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllItems(
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = getUserIdFromToken(authHeader);
            var items = libraryItemRepository.findByUserId(userId);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            System.err.println("ERROR in getAllItems: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}