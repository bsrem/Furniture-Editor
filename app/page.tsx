'use client'

import { useState, useCallback } from 'react'
import { Upload, Download, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import JSZip from 'jszip'

interface ProcessedImage {
  id: string
  originalFile: File
  originalUrl: string
  processedUrl?: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  error?: string
}

export default function FurnitureEditor() {
  const [images, setImages] = useState<ProcessedImage[]>([])
  const [prompt, setPrompt] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileUpload = useCallback((files: FileList) => {
    const newImages: ProcessedImage[] = []
    
    for (let i = 0; i < Math.min(files.length, 30 - images.length); i++) {
      const file = files[i]
      if (file.type.startsWith('image/')) {
        const id = Math.random().toString(36).substr(2, 9)
        const originalUrl = URL.createObjectURL(file)
        
        newImages.push({
          id,
          originalFile: file,
          originalUrl,
          status: 'pending'
        })
      }
    }
    
    setImages(prev => [...prev, ...newImages])
  }, [images.length])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    handleFileUpload(files)
  }, [handleFileUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  const processImages = async () => {
    if (!prompt.trim() || images.length === 0) return

    setIsProcessing(true)
    setProgress(0)

    const updatedImages = [...images]
    
    for (let i = 0; i < updatedImages.length; i++) {
      const image = updatedImages[i]
      
      try {
        updatedImages[i] = { ...image, status: 'processing' }
        setImages([...updatedImages])

        const base64 = await fileToBase64(image.originalFile)
        
        const response = await fetch('/api/process-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64,
            prompt: prompt,
            mimeType: image.originalFile.type
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to process image')
        }

        const result = await response.json()
        
        updatedImages[i] = {
          ...image,
          status: 'completed',
          processedUrl: result.processedImageUrl
        }
        
      } catch (error) {
        updatedImages[i] = {
          ...image,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
      
      setImages([...updatedImages])
      setProgress(((i + 1) / updatedImages.length) * 100)
    }

    setIsProcessing(false)
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        resolve(result.split(',')[1])
      }
      reader.onerror = error => reject(error)
    })
  }

  const downloadAll = async () => {
    const processedImages = images.filter(img => img.status === 'completed' && img.processedUrl)
    
    if (processedImages.length === 0) return

    if (processedImages.length === 1) {
      const link = document.createElement('a')
      link.href = processedImages[0].processedUrl!
      link.download = `furnished_${processedImages[0].originalFile.name}`
      link.click()
    } else {
      const zip = new JSZip()
      
      for (const image of processedImages) {
        try {
          const response = await fetch(image.processedUrl!)
          const blob = await response.blob()
          zip.file(`furnished_${image.originalFile.name}`, blob)
        } catch (error) {
          console.error('Error adding image to zip:', error)
        }
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(zipBlob)
      link.download = 'furnished_rooms.zip'
      link.click()
    }
  }

  const completedCount = images.filter(img => img.status === 'completed').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900">Furniture Editor</h1>
          <p className="text-lg text-slate-600">Add furniture to your empty rooms with AI</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Photos
            </CardTitle>
            <CardDescription>
              Upload up to 30 photos of empty rooms. Supported formats: JPEG, PNG, WebP
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <ImageIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-slate-700 mb-2">
                Drop your photos here or click to browse
              </p>
              <p className="text-sm text-slate-500">
                {images.length}/30 photos uploaded
              </p>
              <input
                id="file-input"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              />
            </div>
          </CardContent>
        </Card>

        {images.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Furniture Description</CardTitle>
              <CardDescription>
                Describe what furniture you'd like to add to your rooms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="e.g., Add a modern sofa, coffee table, and floor lamp to create a cozy living room setup"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
              />
              <Button
                onClick={processImages}
                disabled={!prompt.trim() || isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing Images...
                  </>
                ) : (
                  'Add Furniture to Photos'
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {isProcessing && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing images...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>
            </CardContent>
          </Card>
        )}

        {images.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Photos</CardTitle>
                <CardDescription>
                  {completedCount > 0 && `${completedCount} of ${images.length} processed`}
                </CardDescription>
              </div>
              {completedCount > 0 && (
                <Button onClick={downloadAll} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download All
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden">
                      <img
                        src={image.processedUrl || image.originalUrl}
                        alt="Room"
                        className="w-full h-full object-cover"
                      />
                      {image.status === 'processing' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(image.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                    <div className="mt-2">
                      <p className="text-sm font-medium truncate">{image.originalFile.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${
                          image.status === 'pending' ? 'bg-slate-400' :
                          image.status === 'processing' ? 'bg-blue-500' :
                          image.status === 'completed' ? 'bg-green-500' :
                          'bg-red-500'
                        }`} />
                        <span className="text-xs text-slate-600 capitalize">
                          {image.status === 'error' ? image.error : image.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {images.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">How it works</h3>
                <div className="grid md:grid-cols-3 gap-6 text-sm">
                  <div className="space-y-2">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto font-semibold">1</div>
                    <p className="font-medium">Upload Photos</p>
                    <p className="text-slate-600">Upload up to 30 photos of empty rooms</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto font-semibold">2</div>
                    <p className="font-medium">Describe Furniture</p>
                    <p className="text-slate-600">Tell us what furniture you'd like to add</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto font-semibold">3</div>
                    <p className="font-medium">Download Results</p>
                    <p className="text-slate-600">Get your furnished room photos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
