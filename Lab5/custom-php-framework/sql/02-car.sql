create table car
(
    id      integer not null
        constraint car_pk
            primary key autoincrement,
    brand text not null,
    model text not null,
    color text not null,
    price int not null
);
