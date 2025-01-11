import { createAvatar } from '@dicebear/core';
import { shapes } from '@dicebear/collection';

const users = [
	{
		username: 'durounseki',
		avatar: createAvatar(shapes, {
			seed: 'durounseki',
			radius: 50,
			backgroundColor: ['181818'],
			shape1Color: ['ffa6db'],
			shape2Color: ['fff5ff'],
			shape3Color: ['b4d4ee'],
		}).toString(),
		email: 'durounseki@thedancethread.com',
		password: 'password',
		name: 'Christian',
		nationality: 'Mexico',
		location: 'Japan',
		greeting: "Hey! I'm the developer of the dance thread!",
		bio: `
        Hey there, this is Christian, the developer of this website. I hope you are enjoying your experience using The Dance Thread! Please don't hesitate to contact me to ask questions, make some suggestions, or simply say hello.
            
        Let me tell you a little bit about me, and the story behind The Dance Thread. I'm originally from Mexico, and even though dancing is a big part of our culture, I never dared to learn while living there. I always thought I was too clumsy and felt insecure thinking people would laugh at me. My dance journey actually started when I moved to the UK for my studies. I learned the basics of salsa and bachata there and discovered how beautiful it is to connect with someone through dance. I was instantly hooked! But I still didn't feel confident enough to go out to socials, not to mention that I was extremely busy trying to finish my PhD in the middle of the pandemic back in 2020.
                    
        It wasn't until I came to Okinawa that I really started learning properly, first at Mamboki with Erik Rodriguez and later with Andres y Yuno at Haisai Latina. It took months to build the skills and confidence to ask people to dance. You know how hard it is to step onto the dance floor when you can only do the basic step! But, if you're like me, you also know how fun and addictive dancing can be. There's something magical about losing yourself in the music and movement, spending hours at a dance club without even noticing the time fly by.  You create these strong bonds with people simply by connecting on the dance floor, regardless of what language you speak. It's amazing how dance can create friendships anywhere in the world where there's a welcoming community.
                    
        And speaking of community, it was here in Okinawa that I met Yazmin, who sparked the idea for The Dance Thread. She envisioned an inclusive space for all dancers, which instantly resonated with how I feel about dancing. Coincidentally, at the time, I was looking to start a career in web development. It felt like the perfect partnership! We've been working hard for the last few months and have come up with this initial product. There's still tons of work to do, but we're working relentlessly to connect dancers from all around the world and spread our passion to many more.
                    
        We're working hard to bring you more features soon, including learning resources and opportunities to share your work as dancers, connecting both personally and professionally.
            
        Start exploring The Dance Thread today!
        `,
		style: ['Salsa', 'Bachata', 'Cumbia'],
		sns: [
			{
				name: 'instagram',
				url: 'https://www.instagram.com/durounseki/profilecard/?igsh=MWdvd3RlaXNxbnBlNw==',
				faClass: 'fa-brands fa-instagram',
			},
		],
		preferences: {
			visibility: {
				network: 'private',
				events: 'public',
			},
		},
		following: ['groovyguru'],
		followRequest: ['salsaking98'],
		followerRequest: ['dancingqueen'],
		totalFollowing: 1,
		followedBy: ['bachaterolover'],
		totalFollowedBy: 1,
		danced: ['dancingqueen'],
		totalDanced: 0,
		wantToDance: ['bachaterolover'],
		totalWantToDance: 0,
		eventsGoing: [1, 2, 3, 4],
		eventsCreated: [2],
	},
	{
		username: 'dancingqueen',
		avatar: createAvatar(shapes, {
			seed: 'dancingqueen',
			radius: 50,
			backgroundColor: ['181818'],
			shape1Color: ['ffa6db'],
			shape2Color: ['fff5ff'],
			shape3Color: ['b4d4ee'],
		}).toString(),
		email: 'dancingqueen@example.com',
		password: 'password',
		name: 'Maria',
		nationality: 'Spain',
		location: 'Colombia',
		greeting: "¡Hola! Let's dance!",
		bio: "Passionate salsa and bachata dancer traveling the world! Always looking for new dance partners and exploring different dance styles.  Let's connect and dance!",
		style: ['Salsa', 'Bachata', 'Kizomba'],
		sns: [
			{
				name: 'facebook',
				url: 'https://www.facebook.com/maria.dancer',
				faClass: 'fa-brands fa-facebook',
			},
		],
		preferences: {
			visibility: {
				network: 'private',
				events: 'private',
			},
		},
		following: [],
		followRequest: ['durounseki'],
		followerRequest: [],
		totalFollowing: 0,
		followedBy: [],
		totalFollowedBy: 0,
		danced: [],
		totalDanced: 0,
		wantToDance: [],
		totalWantToDance: 0,
		eventsGoing: [3, 4, 5, 6],
		eventsCreated: [],
	},
	{
		username: 'groovyguru',
		avatar: createAvatar(shapes, {
			seed: 'groovyguru',
			radius: 50,
			backgroundColor: ['181818'],
			shape1Color: ['ffa6db'],
			shape2Color: ['fff5ff'],
			shape3Color: ['b4d4ee'],
		}).toString(),
		email: 'groovyguru@example.com',
		password: 'password',
		name: 'David',
		nationality: 'Brazil',
		location: 'United States',
		greeting: 'Hey! I love zouk and West Coast Swing!',
		bio: 'Zouk and West Coast Swing enthusiast!  I love the connection and flow of these dances. Always up for learning new moves and meeting new people on the dance floor.',
		style: ['Zouk', 'West Coast Swing', 'Other'],
		sns: [
			{
				name: 'instagram',
				url: 'https://www.instagram.com/david.dance/',
				faClass: 'fa-brands fa-instagram',
			},
			{
				name: 'youtube',
				url: 'https://www.youtube.com/@daviddance',
				faClass: 'fa-brands fa-youtube',
			},
		],
		preferences: {
			visibility: {
				network: 'public',
				events: 'public',
			},
		},
		following: [],
		followRequest: [],
		followerRequest: [],
		totalFollowing: 0,
		followedBy: ['durounseki'],
		totalFollowedBy: 1,
		danced: ['dancingqueen', 'bachaterolover'],
		totalDanced: 0,
		wantToDance: [],
		totalWantToDance: 0,
		eventsGoing: [1, 5, 6],
		eventsCreated: [1],
	},
	{
		username: 'bachaterolover',
		avatar: createAvatar(shapes, {
			seed: 'bachaterolover',
			radius: 50,
			backgroundColor: ['181818'],
			shape1Color: ['ffa6db'],
			shape2Color: ['fff5ff'],
			shape3Color: ['b4d4ee'],
		}).toString(),
		email: 'bachaterolover@example.com',
		password: 'password',
		name: 'Aisha',
		nationality: 'Dominican Republic',
		location: 'Dominican Republic',
		greeting: 'Hi! Bachata is my passion!',
		bio: "Bachata is life! I love the music, the connection, and the feeling of this dance.  I'm always happy to share my passion with others. Let's dance bachata!",
		style: ['Bachata', 'Salsa'],
		sns: [],
		preferences: {
			visibility: {
				network: 'public',
				events: 'private',
			},
		},
		following: ['durounseki'],
		followRequest: [],
		followerRequest: [],
		totalFollowing: 1,
		followedBy: [],
		totalFollowedBy: 0,
		danced: [],
		totalDanced: 0,
		wantToDance: [],
		totalWantToDance: 0,
		eventsGoing: [3, 4, 5, 6],
		eventsCreated: [1],
	},

	{
		username: 'salsaking98',
		avatar: createAvatar(shapes, {
			seed: 'salsaking98',
			radius: 50,
			backgroundColor: ['000080'],
			shape1Color: ['ff0000'],
			shape2Color: ['ffff00'],
			shape3Color: ['ffffff'],
		}).toString(),
		email: 'salsaking98@example.com',
		password: 'password',
		name: 'Carlos',
		nationality: 'Cuba',
		location: 'Miami, Florida',
		greeting: '¡Hola! ¡Bailamos!',
		bio: "Salsa is my lifeblood! I've been dancing since I could walk. I love the energy, the rhythm, and the joy of salsa.  Always looking for new partners to dance with!",
		style: ['Salsa', 'Mambo', 'Cha-cha-cha'],
		sns: ['instagram.com/salsaking98'],
		preferences: {
			visibility: {
				network: 'private',
				events: 'public',
			},
		},
		following: [],
		followRequest: ['durounseki'],
		followerRequest: [],
		totalFollowing: 0,
		followedBy: [],
		totalFollowedBy: 0,
		danced: [],
		totalDanced: 0,
		wantToDance: [],
		totalWantToDance: 0,
		eventsGoing: [2, 6],
		eventsCreated: [],
	},
];

const events = [
	{
		id: 1,
		name: 'Saigon Latin Dance Festival',
		date: '2024-12-06',
		venue: [
			{
				name: 'Saigon Prince Hotel',
				url: 'https://www.google.com/maps/place/Saigon+Prince+Hotel+(Formerly+Duxton+Hotel+Saigon)/@10.7718114,106.7004351,14.78z/data=!4m9!3m8!1s0x31752f46cbafffff:0xbbeda6738fc69a7c!5m2!4m1!1i2!8m2!3d10.7728099!4d106.7040688!16s%2Fg%2F11j00snk_w?entry=ttu&g_ep=EgoyMDI0MDgyOC4wIKXMDSoASAFQAw%3D%3D',
			},
		],
		country: 'Vietnam',
		sns: [
			{
				name: 'website',
				url: 'https://saigonlatinfestival.com/',
				faClass: 'fa-solid fa-globe',
			},
			{
				name: 'facebook',
				url: 'https://www.facebook.com/people/Saigon-Latin-Festival-SGLF/61554034468601/?sk=about',
				faClass: 'fa-brands fa-square-facebook',
			},
		],
		dancers: ['dancingqueen', 'durounseki'],
		flyer: {
			alt: 'Saigon Latin Dance Festival',
			src: 'saigonLatinFestival.jpg',
		},
	},
	{
		id: 2,
		name: 'Japan Korea Bachata Connection 2024',
		date: '2024-11-01',
		venue: [
			{
				name: 'Studio UMAYADO',
				venue: 'https://maps.app.goo.gl/Ukfd7VXg5WkrUwmM6?g_st=com.google.maps.preview.copy',
			},
		],
		country: 'Japan',
		sns: [
			{
				name: 'website',
				url: 'https://sonsual-event.square.site',
				faClass: 'fa-solid fa-globe',
			},
			{
				name: 'instagram',
				url: 'https://www.instagram.com/jkbc_2024?igsh=OW02OTdjZXI0YWwx',
				faClass: 'fa-brands fa-instagram',
			},
		],
		dancers: ['bachaterolover'],
		flyer: {
			alt: 'JKBC',
			src: 'jkbc.JPG',
		},
	},
	{
		id: 3,
		name: 'Taiwan Salsa Carnival 2024',
		date: '2024-11-22',
		venue: [
			{
				name: 'NUZONE',
				venue:
					'https://www.google.com/maps/place/NUZONE+%E5%B1%95%E6%BC%94%E7%A9%BA%E9%96%93/@25.04424,121.538495,15z/data=!4m6!3m5!1s0x3442ab63008ad2d1:0x2c071fd16d1e5095!8m2!3d25.04424!4d121.538495!16s%2Fg%2F11fl43q3jx?entry=ttu&g_ep=EgoyMDI0MDgyOC4wIKXMDSoASAFQAw%3D%3D',
			},
		],
		country: 'Taiwan',
		sns: [
			{
				name: 'instagram',
				url: 'https://www.instagram.com/taiwan_salsa_carnival?igsh=aTQ4dGwxMHo4cTUx',
				faClass: 'fa-brands fa-instagram',
			},
			{
				name: 'facebook',
				url: 'https://www.facebook.com/TaiwanSalsaCarnival',
				faClass: 'fa-brands fa-square-facebook',
			},
		],
		dancers: ['durounseki', 'groovyguru'],
		flyer: {
			alt: 'TSC2024',
			src: 'taiwanSalsaCarnival.jpg',
		},
	},
	{
		id: 4,
		name: 'Alonso & Noelia: Linking Japan Bachata Festival',
		date: '2024-11-15',
		venue: [
			{
				name: 'Studio M',
				url: 'https://www.google.com/maps/place/%E6%B1%A0%E8%A2%8B%E3%83%AC%E3%83%B3%E3%82%BF%E3%83%BF%E3%83%AB%E3%82%B9%E3%82%BF%E3%82%B8%E3%82%AA+Studio+M+Ikebukuro+Tokyo/@35.7338274,139.7088884,15z/data=!4m6!3m5!1s0x60188dd9f365f057:0x8cb260fa56ed44e6!8m2!3d35.7338274!4d139.7088884!16s%2Fg%2F11frt6rsqv?entry=ttu&g_ep=EgoyMDI0MDgyOC4wIKXMDSoASAFQAw%3D%3D',
			},
		],
		country: 'Japan',
		sns: [
			{
				name: 'facebook',
				url: 'https://www.facebook.com/events/852745789726373/?active_tab=discussion',
				faClass: 'fa-brands fa-square-facebook',
			},
			{
				name: 'instagram',
				url: 'https://www.instagram.com/linkingjapan/',
				faClass: 'fa-brands fa-instagram',
			},
		],
		dancers: [],
		flyer: {
			alt: 'LinkingAYL',
			src: 'linkingBachata.jpeg',
		},
	},
	{
		id: 5,
		name: 'Bachata Island Vibes: Haisai Latina 9th Anniversary',
		date: '2024-10-12',
		venue: [
			{
				name: 'Bailando',
				url: 'https://maps.app.goo.gl/oz6ioaiKnrgSrFmG7?g_st=com.google.maps.preview.copy',
			},
		],
		country: 'Japan',
		sns: [
			{
				name: 'facebook',
				url: 'https://facebook.com/events/s/bachata-island-vibes-haisai-la/1031425568658276/',
				faClass: 'fa-brands fa-square-facebook',
			},
		],
		dancers: ['durounseki', 'dancingqueen'],
		flyer: {
			alt: 'Haisai',
			src: 'haisai.jpg',
		},
	},
	{
		id: 6,
		name: 'Vietnam Latin Xperience 2024',
		date: '2024-10-04',
		venue: [
			{
				name: 'Phuong Nguyen Restaurant Building',
				url: 'https://www.google.com/maps/place/Phuong+Nguyen+Restaurant/@21.070976,105.8224295,19.74z/data=!4m6!3m5!1s0x3135aaf0d68329f3:0xec83fa3eb422fba8!8m2!3d21.0708775!4d105.8224349!16s%2Fg%2F11b7tgrm1b?entry=ttu&g_ep=EgoyMDI0MDgyOC4wIKXMDSoASAFQAw%3D%3D',
			},
		],
		country: 'Vietnam',
		sns: [
			{
				name: 'website',
				url: 'https://vietnamlatinxperience.com/',
				faClass: 'fa-solid fa-globe',
			},
		],
		dancers: ['groovyguru', 'bachaterolover'],
		flyer: {
			alt: 'VLX2024',
			src: 'vlx.jpeg',
		},
	},
	{
		id: 7,
		name: 'Salsa Bachata Temptation Singapore',
		date: '2024-08-09',
		venue: [
			{
				name: 'MAX Atria Garnet',
				url: 'https://www.google.com/maps/place/Singapore+EXPO+Meeting+Rooms/@1.3332953,103.9567683,15z/data=!4m6!3m5!1s0x31da3d29b4a86847:0x62aaab711af2fcdf!8m2!3d1.3332953!4d103.9567683!16s%2Fg%2F11btww6m0q?entry=ttu',
			},
		],
		country: 'Singapore',
		sns: [
			{
				name: 'website',
				url: 'https://salsabachatatemptation.com/',
				faClass: 'fa-solid fa-globe',
			},
			{
				name: 'facebook',
				url: 'https://www.facebook.com/SBTS2023',
				faClass: 'fa-brands fa-square-facebook',
			},
			{
				name: 'instagram',
				url: 'https://www.instagram.com/Salsabachatatemptationsg/',
				faClass: 'fa-brands fa-instagram',
			},
			{
				name: 'youtube',
				url: 'https://www.youtube.com/channel/UCnFxI6FMl4lAxA1UmY6d2ng',
				faClass: 'fa-brands fa-youtube',
			},
		],
		dancers: ['durounseki', 'dancingqueen', 'groovyguru', 'bachaterolover'],
		flyer: {
			alt: 'SBTS2024',
			src: 'sbts.png',
		},
	},
];

const snsFaClass = {
	website: 'fa-solid fa-globe',
	facebook: 'fa-brands fa-square-facebook',
	instagram: 'fa-brands fa-instagram',
	youtube: 'fa-brands fa-youtube',
};

export { users, events, snsFaClass };
