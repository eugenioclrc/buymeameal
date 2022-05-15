import pinataSDK from '@pinata/sdk';
import dotenv from 'dotenv';
import { ethers } from 'ethers';

dotenv.config();

const pinata = pinataSDK('yourPinataApiKey', 'yourPinataSecretApiKey');

import slugify from 'slugify';

/** @type {import('./index').RequestHandler} */
export const post = async ({ request, locals }) => {
	const form = await request.formData();

	const slug = slugify(form.get('text'), '_').toLocaleLowerCase();
	if (slug.length > 32) {
		return {
			body: {
				error: 'Slug is too long'
			}
		}
	} else if (slug.length < 5) {
		return {
			body: {
				error: 'Slug is too short'
			}
		}
	}


	const username = ethers.utils.formatBytes32String("eugenioclrc");

	// 66 byte string, which represents 32 bytes of data
	let messageHash = ethers.utils.solidityKeccak256 (
									['address', 'bytes32', 'string'],
									['0x4C0407dA3274217214b7De79F6EB982095969A0e', username, 'url']);

	// 32 bytes of data in Uint8Array
	let messageHashBinary = ethers.utils.arrayify(messageHash);
	
	const provider = new ethers.providers.JsonRpcProvider(process.env.MUMBAI_URL);
	const deployer = new ethers.Wallet(process.env.PKEY, provider);
	// To sign the 32 bytes of data, make sure you pass in the data
	const signature = await deployer.signMessage(messageHashBinary);


	return {
		body: {
			signature,
			slug: slugify(form.get('text'), '_').toLocaleLowerCase(),
			username,
		}
	}
};

