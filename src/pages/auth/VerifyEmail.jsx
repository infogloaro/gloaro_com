import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { authApi } from '../../api/auth'
import LoadingScreen from '../../components/common/LoadingScreen'

export default function VerifyEmail() {
  const { token } = useParams()
  const [message, setMessage] = useState('')
  useEffect(() => {
    authApi.verifyEmail(token).then((response) => setMessage(response.data.message)).catch((error) => setMessage(error.response?.data?.message || 'Verification failed'))
  }, [token])
  if (!message) return <LoadingScreen label="Verifying email..." />
  return (
    <div className="w-full rounded-lg bg-white p-6 text-center shadow-xl">
      <h2 className="font-playfair text-4xl font-bold text-[#0d4697]">Email Verification</h2>
      <p className="mt-3 font-semibold text-slate-600">{message}</p>
      <Link to="/login" className="mt-5 inline-block rounded-md bg-[#0d4697] px-5 py-2.5 font-bold text-white">Sign In</Link>
    </div>
  )
}
