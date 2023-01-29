import type { Handle } from '@sveltejs/kit';
import clientPromise from '$lib/server/db';
import init from '$lib/server/db/init';
import { SvelteKitAuth } from '@auth/sveltekit';
import { sequence } from '@sveltejs/kit/hooks';
import { dev } from '$app/environment';
import CredentialsProvider from '@auth/core/providers/credentials';
import GitHub from "@auth/core/providers/github"
import { GITHUB_ID, GITHUB_SECRET } from "$env/static/private"

export const handle = SvelteKitAuth({
    providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })],
  })