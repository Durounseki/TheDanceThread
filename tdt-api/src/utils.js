import { createAvatar } from '@dicebear/core';
import { shapes } from '@dicebear/collection';

const snsFaClass = {
	website: 'fa-solid fa-globe',
	facebook: 'fa-brands fa-square-facebook',
	instagram: 'fa-brands fa-instagram',
	youtube: 'fa-brands fa-youtube',
};

function createUserAvatar(userId) {
	const avatar = createAvatar(shapes, {
		seed: userId,
		radius: 50,
		backgroundColor: ['181818'],
		shape1Color: ['ffa6db'],
		shape2Color: ['fff5ff'],
		shape3Color: ['b4d4ee'],
	}).toString();
	return avatar;
}

export { snsFaClass, createUserAvatar };
