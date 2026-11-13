import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../hooks/useAuth.jsx'
import RegisterPage from './RegisterPage.jsx'

function renderRegisterPage() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('RegisterPage', () => {
  it('keeps focus while typing into each registration field', async () => {
    const user = userEvent.setup()
    renderRegisterPage()

    const fields = [
      [screen.getByPlaceholderText('Your full name'), 'Roshini Julluri'],
      [screen.getByPlaceholderText('you@example.com'), 'roshini@example.com'],
      [screen.getByPlaceholderText('Minimum 8 characters'), 'safe-password-123'],
      [screen.getByPlaceholderText('Repeat your password'), 'safe-password-123'],
    ]

    for (const [field, value] of fields) {
      await user.type(field, value)
      expect(field).toHaveValue(value)
      expect(field).toHaveFocus()
    }
  })
})
