Create DATABASE learning_path;
use learning_path;


create table users(
    id int primary key  auto_increment,
    name varchar(100),
    email varchar(100) unique not null,
    password_hash varchar(255) not null,
    experience_years int default 0,
    desired_role varchar(50),
    created_at timestamp default current_timestamp
);


create table skills(
    id int primary key  auto_increment,
    name varchar(100)not null
);
CREATE table topics(
    id int primary key auto_increment,
    name varchar(140) not null,
    difficulty enum('beginner','intermediate','advanced')
);

create table topic_skills(
    topic_id int ,
  
    skill_id int,
    weight decimal(3,2) default 1.00,
    PRIMARY KEY (topic_id, skill_id),
    foreign key(topic_id)REFERENCES topics(id) on delete cascade,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);

create table user_skills(
    user_id int,
    skill_id int,
   
    score int,
     PRIMARY KEY (user_id, skill_id),
    foreign key(user_id)REFERENCES users(id) on delete cascade,
    foreign key(skill_id)REFERENCES skills(id) on delete cascade

);

create table resources(
    id int primary key auto_increment,
    title varchar(255),
    url text,
    provider varchar(100),
    resource_type enum('course','video','article','exercise'),
    duration_min int,
    difficulty enum('beginner','intermediate','advanced'),
    description text
);

CREATE table topic_resources(
    id int primary key auto_increment,
    topic_id int,
    resource_id int,
    foreign key(topic_id)REFERENCES topics(id) on delete cascade,
    foreign key(resource_id)REFERENCES resources(id)on delete cascade
);


create table learning_paths(
    id int primary key auto_increment,
    user_id int,
    created_at timestamp default current_timestamp,
    foreign key(user_id)REFERENCES users(id) on delete cascade
);

create table learning_path_items(
    id int primary key auto_increment,
    path_id int,
    topic_id int,
    priority decimal(6,4),
    resource_id int,
    is_completed boolean default false,
    FOREIGN KEY (path_id) REFERENCES learning_paths(id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES topics(id),
  FOREIGN KEY (resource_id) REFERENCES resources(id)
);

