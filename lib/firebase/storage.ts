import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadTaskSnapshot,
} from 'firebase/storage'
import { storage } from '@/firebase.config'

// Upload file with progress
export async function uploadFile(
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const storageRef = ref(storage, path)
  const uploadTask = uploadBytesResumable(storageRef, file)
  
  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot: UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        if (onProgress) {
          onProgress(progress)
        }
      },
      (error) => {
        reject(error)
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        resolve(downloadURL)
      }
    )
  })
}

// Upload event image
export async function uploadEventImage(
  file: File,
  eventId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const timestamp = Date.now()
  const fileName = `${timestamp}_${file.name}`
  const path = `events/${eventId}/${fileName}`
  
  return await uploadFile(file, path, onProgress)
}

// Upload user profile picture
export async function uploadProfilePicture(
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const timestamp = Date.now()
  const fileName = `${timestamp}_${file.name}`
  const path = `users/${userId}/profile/${fileName}`
  
  return await uploadFile(file, path, onProgress)
}

// Upload review photos
export async function uploadReviewPhotos(
  files: File[],
  eventId: string,
  reviewId: string,
  onProgress?: (progress: number) => void
): Promise<string[]> {
  const uploadPromises = files.map((file, index) => {
    const timestamp = Date.now()
    const fileName = `${timestamp}_${index}_${file.name}`
    const path = `reviews/${eventId}/${reviewId}/${fileName}`
    return uploadFile(file, path, onProgress)
  })
  
  return await Promise.all(uploadPromises)
}

// Upload ticket QR code
export async function uploadTicketQRCode(
  file: File,
  bookingId: string
): Promise<string> {
  const path = `tickets/${bookingId}/qr-code.png`
  return await uploadFile(file, path)
}

// Delete file
export async function deleteFile(fileUrl: string): Promise<void> {
  const fileRef = ref(storage, fileUrl)
  await deleteObject(fileRef)
}

// Delete all files in a folder
export async function deleteFolder(folderPath: string): Promise<void> {
  const folderRef = ref(storage, folderPath)
  const fileList = await listAll(folderRef)
  
  const deletePromises = fileList.items.map(fileRef => deleteObject(fileRef))
  await Promise.all(deletePromises)
  
  // Recursively delete subfolders
  const folderPromises = fileList.prefixes.map(folderRef =>
    deleteFolder(folderRef.fullPath)
  )
  await Promise.all(folderPromises)
}

// Get file URL
export async function getFileURL(path: string): Promise<string> {
  const fileRef = ref(storage, path)
  return await getDownloadURL(fileRef)
}

// Upload multiple files
export async function uploadMultipleFiles(
  files: File[],
  basePath: string,
  onProgress?: (fileIndex: number, progress: number) => void
): Promise<string[]> {
  const uploadPromises = files.map((file, index) => {
    const timestamp = Date.now()
    const fileName = `${timestamp}_${index}_${file.name}`
    const path = `${basePath}/${fileName}`
    
    return uploadFile(file, path, (progress) => {
      if (onProgress) {
        onProgress(index, progress)
      }
    })
  })
  
  return await Promise.all(uploadPromises)
}

