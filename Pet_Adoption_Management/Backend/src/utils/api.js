export async function confirmPasswordReset({ token, newPassword }) {
  try {
    const response = await fetch('/api/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, newPassword })
    });

    if (!response.ok) {
      throw new Error('Password reset failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in confirmPasswordReset:', error);
    throw error;
  }
}