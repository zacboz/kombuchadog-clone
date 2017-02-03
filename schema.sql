CREATE TABLE dogs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30),
  story TEXT,
  image TEXT,
  adopted BOOLEAN
);

CREATE TABLE merchandise (
  id SERIAL PRIMARY KEY,
  item VARCHAR(30),
  title TEXT,
  price VARCHAR(10),
  description TEXT,
  image TEXT
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customerName VARCHAR(40),
  email TEXT,
  shippingAddress TEXT,
  billingAddress TEXT,
  purchaseDate DATE,
  amount INT
);

CREATE TABLE orderitems (
  id SERIAL PRIMARY KEY,
  orderId INT references orders,
  productId INT references merchandise,
  size VARCHAR(10),
  quantity INT
);

-- CREATE TABLE locations (
--   id SERIAL PRIMARY KEY,
--   store VARCHAR(30),
--   address TEXT,
--   phone VARCHAR(30),
--   hours TEXT,
--   website TEXT
-- );

-- CREATE TABLE cart (
--   id SERIAL PRIMARY KEY,
--   productId INT references merchandise,
--   title TEXT,
--   price VARCHAR(10),
--   image TEXT,
--   size VARCHAR(10),
--   quantity INT
-- );

-- CREATE TABLE users (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(30),
--   location TEXT,
--   imageurl TEXT
-- );

======================================================
      UP FOR ADOPTION
======================================================

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Bart and Lisa', 'Bart and Lisa are a Dachshund/Jack Russell mix brother-sister duo. 1-and-a-half-years-old. these two both started out quite shy, but their strong sense of curiosity (and fondness for scratches under their chins) encouraged them to open up to us. They definitely have an adorable bond - evident in the way they cuddle in a yin and yang - and we are featuring them together in hopes they can go to the same forever home. They are currently being hosted at The Dog Cafe Los Angeles.', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/579119519de4bbacedc61438/58262781e58c62c0e47d7d22/1478898561326/Bart+and+Lisa+Web.jpg?format=2500w', false);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Phoenix', 'Phoenix is an amazing dog with a heartbreaking story. He was found chained to a fence and hidden under bushes when the rescuer was walking his other dog. Phoenix had been chained to a car and dragged behind it, then chained to the fence. When he was rescued by A Wish For Animals, he was missing fur in many places. But he is a survivor and still has the heart to love people. He is sweet and good with other dogs. He is house trained, but needs a yard, not an apartment. Please contact A Wish For Animals.', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/579119519de4bbacedc61438/57e062466b8f5b1b69058012/1479412090432/39-phoenix.jpg?format=750w', false);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Luke Sr', 'Luke is an 8 year old Rhodesian Ridgeback mix whose owner died. He is truly the gentlest of giants (100 lbs) and is phenomenal with young kids. His foster mom has a 5 year old and he loves her so much. Luke thinks he is a small dog and would love nothing more than to spend the day in your lap. His bio sounds like a doggy singles ad: He loves going for walks on the beach, car rides, tasty food, and meeting new people. If he thinks you''re a softie, he''ll drop to the ground, roll around on his back and show you his belly in exchange for a tummy rub. They don’t make them any happier than Luke.

Luke does have a bad back leg and a little arthritis but it doesn’t stop him from running and jumping and while he loves other dogs he is overly interested in very small ones. That said, he can be distracted easily from them as his interest in them is really that he wants to play. Luke walks well on a leash but at times can get a little too excited about saying hi when he sees a new dog or person so, because of his size, should be with a fairly experienced dog person. No cats for Luke. He had some food aggression issues in his last home so we would prefer to place him as an only dog. Learn more at Ridgebacks and Friends!', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/579119519de4bbacedc61438/57e147dd579fb32aef32d500/1479412090448/42-luke-sr.jpg?format=750w', false);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Robo', 'Here''s Robo! You can find this Jack Russell mix on the front of some of our Ginger bottles. This absolutely adorable fun guy likes dogs - as long as he gets to be the boss!!! Robo is affectionate and well mannered. He enjoys his walks and loves to play in the Barkyard. At around fifteen pounds and six years of age Robo is full grown. We think he would enjoy a quiet home and someone to lavish him with attention. Robo is currently being house at the Glendale Humane Society.', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/579119519de4bbacedc61438/57e06500d2b857ab4a6897ec/1479412090843/07-robo.jpg?format=750w', false);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Coco', 'Coco is a great dog. She is super sweet and adores kids and cats. Her best friend is a 12 pound chihuahua, but she can be choosy on the dogs she likes. But she LOVES kids and cats and has been waiting a long time for a home of her own. If you would like to give Coco her forever home, please visit The Little Red Dog.', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/579119519de4bbacedc61438/58262c242e69cf4ccccf6fc3/1479412090486/Coco+Web.jpg?format=2500w', false);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Sargent', 'Sargent is devoted, loyal, and searching for love. This Terrier & Miniature Pinscher mix who graced the front of our Just Kombucha bottles is still looking for his forever home. He loves to go out for walks, but if you want to be a couch potato he is definitely down with that too. Sargent is at A Dog''s Life Rescue.', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/579119519de4bbacedc61438/5791323720099e5024f0a563/1479412090726/sargeant.jpg?format=750w', false);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Bentley', 'Bentley is a happy, trained, socialized, exuberant, playful 1 year and 2 month old neutered boy. Thanks to Ridgebacks & Friends Rescue and The Zen Dog, he has made a full recovery from his previous, abusive life. And as much as Bentley loves his my foster home, everyone agrees he''s ready for his forever home. Ideally, he would like that home to have another dog (or two) that he can hang or play with and some land for them to run around on. He loves car rides, especially if you''re headed to the dog park or beach. He''s not one of those dogs that barks just to hear himself bark - he only barks for cause. If you think you''re a good match, feel free to contact Ridgebacks & Friends and fill out an application.', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/579119519de4bbacedc61438/5791196715d5db168a16a2b3/1479412090863/bentley-1.jpg?format=2500w', false);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Shadow', 'Shadow was dumped in a rural area, but luckily a Chew''s Life Dog Rescue volunteer saw him being dumped and grabbed him before he could get hit by a car. Shadow is a 35-pound Sharpit (Sharpei-Pit Bull mix). He is 1 and 1/2 years old, loves other dogs and all people. He learns very quickly and has a lot of energy. Shadow would thrive in a home where he can go hiking and have lots of play time.', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/579119519de4bbacedc61438/57e064e815d5db85e0fb3afa/1479412090592/02-shadow.jpg?format=750w', false);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Thor', 'Thor has a very special story. He was rescued from the streets of Mexico where he was found stray, dragging his failed hind legs, and living off garbage. Local rescuers reached out and crossed him over the border to The REAL Bark. He has been in rehab ever since and can now walk on his own (well, mostly)! He needs a special home that can help him continue his rehab and ongoing physical therapy. Thor is super friendly with dogs and humans, and loves to hand out kisses.', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/579119519de4bbacedc61438/57e066118419c20456d64b29/1479412090664/3-thor.jpg?format=750w', false);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Captain', 'Captain is 2 years old an was rescued by The Little Red Dog from a shelter in Carson that was going to euthanize him. Captain is a sweet boy who is great with people. He is about a year and a half old. He has completed obedience training. He needs to be the only animal in the house (no cats or dogs) but he will love you like no other. He is well trained, walks well on the leash and is great with kids, but he can be vocal on the walks when he sees another dog he doesn''t like. Find out more about Captain at The Little Red Dog.', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/579119519de4bbacedc61438/57e062416b8f5b1b69057fb5/1479412090849/33-captain.jpg?format=750w', false);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Bandit', 'Bandit has so much love to give, but no one was giving him a chance. CARE Rescue LA took that chance with him, and saved him from a high kill shelter. They soon realized that although he doesn’t socialize well with other doggies, he was an incredibly friendly, lovable “lap dog” with people! He has gone through intensive training and is very obedient, he loves affection and will make a wonderful companion! Bandit wants to be your one and only, no other pets in the household please. Bandit is between 3-4 years old, housebroken, fixed, and ready to meet his Best Friend Forever! Please visit www.carerescuela.org.

Update on Bandit, November 2016: Bandit just complete a six week training course, and is getting along better with other dogs! Please fill out an inquiry form for Care Rescue below!', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/579119519de4bbacedc61438/57e06241d482e9289dce8627/1479412090758/32-bandit.jpg?format=2500w', false);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Clyde', 'Meet Clyde, a 3 year old beautiful Pittie mix who loves everyone he meets. His tail is always wagging and he just longs for affection. Clyde is a BIG goofball who enjoys walks, hikes, car rides and snuggle time. He is EXCELLENT with other dogs, cats and kids and loves to be with his human. This boy is a GEM. Learn more about Clyde at Bullies and Buddies.', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/579119519de4bbacedc61438/57e06242d482e9289dce8684/1479412090922/34-clyde.jpg?format=750w', false);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Ginger', 'Ginger came to us from The Little Red Dog. She is a sweet girl, who had 7 pups which are all adopted, and now she needs her own forever home. She is good with little dogs and calm bigger dogs. She needs an active, experienced household. She is a great dog, just needs some fine tuning - but will love you to no end.', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/579119519de4bbacedc61438/57e062426b8f5b1b69058002/1479412090961/35-ginger.jpg?format=2500w', false);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Goose', 'Goose was brought to A Wish For Animals with his brother at about 4 months old. Now he is about 4 1/2 years old. He had a home for awhile but the family moved and the situation did not allow for them to keep him. He has spent most of his life in a kennel, and the rescue is trying to do whatever they can to find him a forever home! He is an easy going goof! Please visit A Wish For Animals to learn more.', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/579119519de4bbacedc61438/57e06243d482e9289dce8692/1479412090987/35-goose.jpg?format=750w', false);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Zoey', 'Zoey is about 5 years old. She was rescued from a shelter at 6 months old, and after 4 1/2 years, the family is moving and she is being rescued again. She''s wonderful with people and kids. She loves her walks, hot dogs, and tearing apart squeaky toys, and she''s crate trained. She''s still very active and listens well. She loves her walks!!! She sleeps in her crate every night. She''s great indoors or out. She is choosy with dogs; some she likes, some she doesn''t. We do not know about cats. If you would like to give Zoey her forever home, please visit The Little Red Dog.', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/579119519de4bbacedc61438/57e06247d482e9289dce86ff/1479412091116/41-zoey.jpg?format=750w', false);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Sawyer', 'Sawyer is a 2 - 3 year old loveable ball of fluff! He was adopted from a rescue group, and then brought back to The Zen Dog. He now lives there and the staff can arrange a meet & greet for introductions to people and other dogs! He is great with other dogs, and good with people.', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/579119519de4bbacedc61438/57e062476b8f5b1b6905804b/1479412091156/40-sawyer.jpg?format=1500w', false);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('LaLa', 'Sweet LaLa needs a break! She was adopted recently to an amazing family with 2 other dogs. Unfortunately one of the dogs, a senior, recently started attacking LaLa. We know that when dogs age, sometimes health issues pop up and throw “the pack” off and different behaviors arise-so therefore LaLa is back with Bullies and Buddies for her and the other dog''s safety, and is looking AGAIN for a real home!', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/579119519de4bbacedc61438/58265932197aea524a9e492d/1479412091211/LaLa+Web.jpg?format=1500w', false);

=============================================
ADOPTED
=============================================

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Marlee', 'Marlee is a 4-year-old Pit Bull Terrier/Cane Corso Mastiff mix. She was found in pretty bad shape when the Riverside Animal Control picked her up and brought her to the shelter. Luckily, she was rescued from the shelter by Chew''s Life Dog Rescue, but is still looking for her forever home. Marlee is a wonderful dog with an abundance of love to give. She is crate trained, but also loves to go out on walks and hikes. She is still insecure about the world and needs a slow introduction to humans, but once she warms up, Marlee turns into a 60 lb. lap dog.', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/57bdb0c22994ca36c2f66524/57eb0a47e3df28caea8a822a/1475090150349/01-marlee.jpg?format=2500w', true);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Precious', 'After 7 months in foster, Precious was adopted! Congratulations to Precious and Dogs Without Borders! ', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/57bdb0c22994ca36c2f66524/582dfcc8c534a522cfbfdf3e/1484451280991/Precious+Web.jpg?format=750w', true);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Prince', '', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/57bdb0c22994ca36c2f66524/582a1459893fc0eadc79aaa4/1484451281018/Prince.jpg?format=750w', true);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Kona', 'Kona was rescued by Dogs Without Borders. She is about 9 months old, loves other dogs, and is very playful. She is very exciteable and will growl or bark a little at first until she gets to know someone new. She loves people more than dogs, and does not get along with cats. She loves to cuddle on pillows and will play outside, but is so easy going that she will also be happy at home.', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/57bdb0c22994ca36c2f66524/5810eff8f5e231eacba9748e/1484451281007/kona.jpg?format=750w', true);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Ashley', 'We are so happy Ashley has found a loving home. Check back soon for more information on this successful adoption!', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/57bdb0c22994ca36c2f66524/58266f9e9de4bb1fe2dead21/1484451281010/Ashley+Web.jpg?format=750w', true);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Patricia', 'Patricia was adopted from MaeDay Rescue in October, 2016! Congratulations, Patricia!', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/57bdb0c22994ca36c2f66524/58010e088419c2e268744f50/1484451281016/Patricia.jpg?format=750w', true);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Augustus Gloop', '', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/57bdb0c22994ca36c2f66524/57bdda9e9f74564c5c5772c1/1484451281048/29-augustus-gloop.jpg?format=750w', true);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Dazzle', 'Dazzle, named for her irrepressible spirit and love bug personality, was abandoned over a year ago at a shelter in downtown Los Angeles. The odds were stacked against this little beagle girl with the gorgeous brindle coat because she had a back injury that left her paralyzed in her hind legs. Special needs animals at shelters are often among the first to be euthanized because they require expensive medical care. But Dazzle was not going to be another statistic. In no time, the 5-year-old pup wowed shelter staff with her loving and resilient nature, determined to adapt to her injury, join a loving family and live her life.

A volunteer from the downtown shelter contacted Much Love Animal Rescue to save Dazzle. Much Love could not resist so they pulled her from the shelter in May 2015, got her a doggie wheel chair, and put her into foster care.  A devoted volunteer team began working on her behalf and Dazzle regained her strength, smile and ability to get around. She made an appearance on Fox 11 Pet Project and had many visitors to Much Love’s Santa Monica adoption event. But her golden opportunity came when Kombucha Dog asked Dazzle to be the model for their delicious new Raspberry flavor.  After buying a bottle, a Southern California couple went to Kombucha Dog’s web site for more information, contacted her Much Love foster mom, and set up a meet and greet with Dazzle in June. It was love at first sight. Her new Dad told us, “Dazzle is an amazing dog. We love her very much and she’s adapting well. We would like to tell everybody how much we appreciate everything that you all have done. I’ve been in a wheelchair for over 30 years, and she inspires me.”', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/57bdb0c22994ca36c2f66524/57bdda84f5e231b6bdaa3abb/1484451281050/04-dazzle.jpg?format=750w', true);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Gus', '“Gus is now Bandit, and he really lives up to his name. He loves to scurry away socks from the hamper, not to chew but to make a nest out of. Although last night he “stole” a hamburger off the table and absconded with that. He has a brother, Shadow, who was adopted last year from North Central Animal Shelter and they are best friends.”', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/57bdb0c22994ca36c2f66524/57bdda9f9f74564c5c5772cd/1484451281055/30-gus.jpg?format=750w', true);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Hercules', '“I couldn''t imagine my life without Hercules. He''s provided me comfort and companionship and he''s made my house a home.”

Hercules was adopted in March. His new owner says they''ve been spending their time hiking in Glassell Park and going to the dog park daily while attending the Jazz Festival in Marina Del Rey on the regular!', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/57bdb0c22994ca36c2f66524/57bdda8cf5e231b6bdaa3b36/1484451281130/10-hercules.jpg?format=750w', true);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Sadie', 'Trained Dogs For Adoption reports that Sadie is happy in her new home! Please visit traineddogsforadoption.org for more info.', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/57bdb0c22994ca36c2f66524/57e15a1cd1758e4444a743ba/1484451281131/11-sadie.jpg?format=750w', true);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Spartacus', '', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/57bdb0c22994ca36c2f66524/57e15a76440243e46dafeeeb/1484451281133/43-spartacus.jpg?format=750w', true);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Steven Tyler Jr.', '', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/57bdb0c22994ca36c2f66524/57bdda919f74564c5c5771f2/1484451281139/14-steven-tyler-jr..jpg?format=750w', true);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Yoko', 'Yoko came to The Mutt Scouts nearly starved and covered in mange. What little hair she had was so dry and brittle it was obvious she had been on the streets for a very long time. In the past few months Yoko has turned into the happiest, healthiest and smartest dog you could meet! She loves to play with other dogs! She is very sumbussive and tolerant. She loves the crate- it is her own little den. She is quiet and listens well. Yoko would make a great hiking companion or agility dog!', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/57bdb0c22994ca36c2f66524/57bdda929f74564c5c5771f9/1484451281150/16-yoko.jpg?format=750w', true);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Khaleesi', '', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/57bdb0c22994ca36c2f66524/5810f2a746c3c43d387db9c7/1484451281165/khalessi.jpg?format=750w', true);

INSERT INTO dogs
(name, story, image, adopted)
VALUES ('Peggy', '', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/57bdb0c22994ca36c2f66524/582a157be3df28280cad532f/1484451281176/38-peggy.jpg?format=750w', true);

=============================================
MERCHANDISE
=============================================


INSERT INTO merchandise
(item, title, price, description, image)
VALUES ('Yoko Tee Shirt', 'Yoko Adopt Happiness Tee Shirt', '30.00', 'Super Soft Poly Fitted Tee', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/57e553b58419c29418bcd2ba/57ec69dc15d5db158dfe3f5e/1475169383153/T-Shirt%2BYoko.jpg?format=1500w');

INSERT INTO merchandise
(item, title, price, description, image)
VALUES ('Captain Tee Shirt', 'Captain Adopt Happiness Tee Shirt', '30.00', 'Super Soft Poly Fitted Tee', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/57e553b58419c29418bcd2ba/57ec69c415d5db158dfe3ea0/1475169395541/T-Shirt%2BCaptain.jpg?format=1500w');

INSERT INTO merchandise
(item, title, price, description, image)
VALUES ('Bentley Tee Shirt', 'Bentley Adopt Happiness Tee Shirt', '30.00', 'Super Soft Poly Fitted Tee', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/57e553b58419c29418bcd2ba/57ec69b715d5db158dfe3e36/1475169414146/T-Shirt%2BBentley.jpg?format=1500w');

INSERT INTO merchandise
(item, title, price, description, image)
VALUES ('Patricia Tee Shirt', 'Patricia Adopt Happiness Tee Shirt', '30.00', 'Super Soft Poly Fitted Tee ', 'https://static1.squarespace.com/static/578ffe17e6f2e15aa9c2207f/57e553b58419c29418bcd2ba/57ec69cf15d5db158dfe3f08/1475169427343/T-Shirt%2BPatricia.jpg?format=1500w');
