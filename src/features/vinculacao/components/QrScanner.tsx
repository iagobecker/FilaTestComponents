'use client'

import { useEffect, useRef, useState } from 'react'
import jsQR from 'jsqr'
import { Button } from '@/components/ui/button'

interface ScannerQRCodeProps {
  onResult: (code: string) => void
}

export function ScannerQRCode({ onResult }: ScannerQRCodeProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  useEffect(() => {
    if (isScanning) {
      startCamera()
    }

    return () => stopCamera()
  }, [isScanning])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.setAttribute('playsinline', 'true') // iOS compatibility
        await videoRef.current.play()
      }

      setStream(stream)
      scanLoop()
    } catch (err) {
      alert('Erro ao acessar a câmera. Verifique permissões.')
      console.error(err)
    }
  }

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop())
    setStream(null)
    setIsScanning(false)
  }

  const scanLoop = () => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    const tick = () => {
      if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
        requestAnimationFrame(tick)
        return
      }

      canvas.height = videoRef.current.videoHeight
      canvas.width = videoRef.current.videoWidth
      context?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)

      const imageData = context?.getImageData(0, 0, canvas.width, canvas.height)
      if (imageData) {
        const code = jsQR(imageData.data, imageData.width, imageData.height)
        if (code?.data) {
          stopCamera()
          onResult(code.data)
          return
        }
      }

      requestAnimationFrame(tick)
    }

    tick()
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      {!isScanning ? (
        <Button onClick={() => setIsScanning(true)} className="bg-blue-500 text-white">
          Abrir câmera para scanear QR Code
        </Button>
      ) : (
        <Button onClick={stopCamera} className="bg-red-500 text-white">
          Parar scanner
        </Button>
      )}

      <video ref={videoRef} className="w-full max-w-sm rounded shadow" autoPlay muted playsInline />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
