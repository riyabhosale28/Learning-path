use learning_path;

insert into skills(name)values('javascript'),('react'),('node'),('sql'),('algorithms'),('data-structures');

INSERT INTO topics(name,difficulty)VALUES
('Asynchronous Javascript','intermediate'),
('React Hooks and State Management','intermediate'),
('Node.js APIs & Express', 'intermediate'),
('SQL Joins & Optimization', 'intermediate'),
('Dynamic Programming', 'advanced');


INSERT INTO topic_skills (topic_id, skill_id, weight) VALUES
(1, 1, 0.8), -- async js -> javascript
(2, 2, 0.9), -- react hooks -> react
(3, 3, 0.9), -- node apis -> node
(4, 4, 1.0), -- sql joins -> sql
(5, 5, 1.0); -- dp -> algorithms



INSERT INTO resources (title, url, provider, resource_type, duration_min, difficulty, description) VALUES
('MDN: Asynchronous concepts', 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous', 'MDN', 'article', 45, 'beginner', 'Guide to callbacks, promises, async/await'),
('FreeCodeCamp: React Hooks', 'https://www.freecodecamp.org/learn/front-end-libraries/react', 'freeCodeCamp', 'course', 180, 'intermediate', 'React hooks and state management'),
('Node.js Crash Course', 'https://www.youtube.com/watch?v=fBNz5xF-Kx4', 'YouTube', 'video', 120, 'intermediate', 'Express and APIs'),
('SQL Joins Explained', 'https://www.youtube.com/watch?v=9Pzj7Aj25lw', 'YouTube', 'video', 35, 'beginner', 'Practical joins'),
('Dynamic Programming Intro', 'https://www.geeksforgeeks.org/dynamic-programming/', 'GeeksforGeeks', 'article', 60, 'advanced', 'DP explained with examples');


INSERT INTO topic_resources (topic_id, resource_id) VALUES
(1,1),(2,2),(3,3),(4,4),(5,5);