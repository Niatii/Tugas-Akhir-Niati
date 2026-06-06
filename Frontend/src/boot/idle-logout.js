let idleTimer = null

const IDLE_LIMIT = 60 * 60 * 1000 // 1 jam

export default async ({ router }) => {
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('loginTime')

    // Redirect dan refresh page untuk ensure state bersih
    router.push('/auth/login').then(() => {
      window.location.reload()
    })
  }

  const resetTimer = () => {
    const token = localStorage.getItem('token')

    // kalau belum login, jangan jalankan timer
    if (!token) return

    clearTimeout(idleTimer)

    idleTimer = setTimeout(() => {
      logout()
    }, IDLE_LIMIT)
  }

  const events = [
    'mousemove',
    'mousedown',
    'click',
    'scroll',
    'keypress',
    'touchstart',
  ]

  events.forEach((event) => {
    window.addEventListener(event, resetTimer)
  })

  resetTimer()
}