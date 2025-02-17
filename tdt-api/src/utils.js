import { createAvatar } from '@dicebear/core';
import { shapes } from '@dicebear/collection';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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

async function generateSignedUrl(s3, bucket, key) {
	if (!key) return null;
	const command = new GetObjectCommand({
		Bucket: bucket,
		Key: key,
	});

	try {
		const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
		return url;
	} catch (error) {
		console.error(`Error generating signed url for ${key}`, error);
		return null;
	}
}

export { snsFaClass, createUserAvatar, generateSignedUrl };
