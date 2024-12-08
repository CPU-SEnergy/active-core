import React from 'react'
import { clientConfig, serverConfig } from '@/lib/config';
import { getTokens } from 'next-firebase-auth-edge';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import RegisterPageClient from './RegisterPageClient';

export default async function Login() {
  const tokens = await getTokens(cookies(), {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });

  if (tokens) {
    redirect('/')
  }
  return (
    <RegisterPageClient />
  )
}