async function getAuthToken() {
  try {
    const response = await fetch(`${process.env.KINDE_ISSUER_URL}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        client_id: process.env.KINDE_CLIENT_ID,
        client_secret: process.env.KINDE_CLIENT_SECRET,
        grant_type: 'client_credentials',
        audience: `${process.env.KINDE_ISSUER_URL}/api`,
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to get auth token: ${response.statusText}`)
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('Error getting auth token:', error)
    throw error
  }
}

async function addLogoutUrlToKinde(token) {
  try {
    const response = await fetch(
      `${process.env.KINDE_ISSUER_URL}/api/v1/applications/${process.env.KINDE_CLIENT_ID}/auth_logout_urls`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls: [`https://${process.env.VERCEL_URL}`],
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to add logout URL to Kinde: ${response.statusText}`)
    }

    const responseData = await response.json()
    console.log(`SUCCESS: Logout URL added to Kinde: ${process.env.VERCEL_URL}`, responseData)
  } catch (error) {
    console.error('Failed to add logout URL to Kinde', error)
    throw error
  }
}

async function addCallbackUrlToKinde(token) {
  try {
    const response = await fetch(
      `${process.env.KINDE_ISSUER_URL}/api/v1/applications/${process.env.KINDE_CLIENT_ID}/auth_redirect_urls`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls: [`https://${process.env.VERCEL_URL}/api/auth/kinde_callback`],
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to add callback URL to Kinde: ${response.statusText}`)
    }

    const responseData = await response.json()
    console.log(
      `SUCCESS: Callback URL added to Kinde: ${process.env.VERCEL_URL}/api/auth/kinde_callback`,
      responseData,
    )
  } catch (error) {
    console.error('Failed to add callback URL to Kinde', error)
    throw error
  }
}

;(async () => {
  if (process.env.VERCEL == 1) {
    try {
      const authToken = await getAuthToken()
      await addCallbackUrlToKinde(authToken)
      await addLogoutUrlToKinde(authToken)
    } catch (error) {
      console.error('Script failed:', error)
    }
  }
})()
