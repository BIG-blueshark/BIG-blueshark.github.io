insert into books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
values ("어린왕자들", 7, 0, "종이책", 0 , "어리다..", "많이 어리다..", "김어림", 100, "목차입니다.", 20000, "2019-01-01");

insert into books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
values ("신데렐라들", 10, 0, "종이책", 1, "유리구두..", "투명한 유리구두..", "김구두", 100, "목차입니다.", 20000, "2023-12-01");

insert into books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
values ("백설공주들", 60, 1, "종이책", 2, "사과..", "빨간 사과..", "김사과", 100, "목차입니다.", 20000, "2023-11-01");

insert into books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
values ("흥부와 놀부들",90, 2, "종이책", 3, "제비..", "까만 제비..", "김제비", 100, "목차입니다.", 20000, "2023-12-08");

insert into books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
values ("콩쥐 팥쥐", 4, 0, "ebook", 4, "콩판..", "콩심은데 콩나고..", "김콩팥", 100, "목차입니다.", 20000, "2023-12-07");

insert into books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
values ("용궁에 간 토끼", 5, 1, "종이책", 5, "깡충..", "용왕님 하이..", "김거북", 100, "목차입니다.", 20000, "2023-10-01");

insert into books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
values ("해님달님", 15, 2, "ebook", 6, "동앗줄..", "황금 동앗줄..", "김해님", 100, "목차입니다.", 20000, "2023-07-16");

insert into books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
values ("장화홍련전", 80, 0, "ebook", 7, "기억이 안나요..", "장화와 홍련이?..", "김장화", 100, "목차입니다.", 20000, "2023-03-01");

insert into books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
values ("견우와 직녀", 8, 1, "ebook", 8, "오작교!!", "칠월 칠석!!", "김다리", 100, "목차입니다.", 20000, "2023-02-01");

insert into books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
values ("효녀 심청", 12, 0, "종이책", 9, "심청아..", "공양미 삼백성..", "김심청", 100, "목차입니다.", 20000, "2023-01-15");

insert into books (title, img, category_id, form, isbn, summary, detail, author, pages, contents, price, pub_date)
values ("혹부리 영감", 22, 2, "ebook", 10, "노래 주머니..", "혹 두개 되버림..", "김영감", 100, "목차입니다.", 20000, "2023-06-05");

select * from books left
join category on books.category_id = category.id;

select * from books left join category on books.category_id = category.id where books.id=1;

insert into likes (user_id, liked_book_id) values(1, 1);
insert into likes (user_id, liked_book_id) values(1, 2);
insert into likes (user_id, liked_book_id) values(1, 3);
insert into likes (user_id, liked_book_id) values(3, 1);
insert into likes (user_id, liked_book_id) values(4, 4);
insert into likes (user_id, liked_book_id) values(2, 1);
insert into likes (user_id, liked_book_id) values(2, 2);
insert into likes (user_id, liked_book_id) values(2, 3);
insert into likes (user_id, liked_book_id) values(2, 5);

delete from likes
where user_id = 1 and liked_book_id = 3;

