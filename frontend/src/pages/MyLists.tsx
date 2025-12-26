import './MyLists.css';

const MyLists = () => {
  return (
    <div className="my-lists-content">
      <div className="coming-soon-card">
        <div className="coming-soon-icon">📝</div>
        <h1>My Lists</h1>
        <p>Create and manage custom lists for your library items.</p>
        <div className="coming-soon-badge">Coming Soon</div>
        <p className="helper-text">
          This feature is under development. Soon you'll be able to create custom lists like "Want to Read", "Currently Watching", and more!
        </p>
      </div>
    </div>
  );
};

export default MyLists;