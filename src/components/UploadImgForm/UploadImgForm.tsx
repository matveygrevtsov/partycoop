import React, { useRef, useState } from 'react'
import firebaseApp from '../../firebaseApp'
import styles from './UploadImgForm.module.css'
import noImageSelected from '../../images/noImageSelected.png'
import preloader from '../../images/preloader.gif'
import InternetConnectionProblem from '../InternetConnectionProblem/InternetConnectionProblem'

const storage = firebaseApp.storage()

interface UploadImgFormInterface {
  setNewImage: (src: string) => void
  startImageSrc?: string
  folder: string
  id: string
}

const UploadImgForm: React.FC<UploadImgFormInterface> = (props) => {
  const [previewSrc, setPreviewSrc] = useState(props.startImageSrc || '')
  const [pending, setPending] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [connection, setConnection] = useState(true)
  const inputFileRef: any = useRef()

  const onFileChange = async (event: any) => {
    setErrorText('')
    setPending(true)
    const file = event.target.files[0]
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      setErrorText('Only .jpg and .png formats are allowed!')
      setPending(false)
      event.target.value = null
      return
    }
    try {
      const ref = storage
        .ref()
        .child(
          'images/' +
            props.folder +
            '/' +
            props.id +
            '/' +
            String(new Date().getTime()),
        )
      await ref.put(file)
      const src: string = await ref.getDownloadURL().then((srcResponse) => {
        setPreviewSrc(srcResponse)
        return srcResponse
      })
      setPreviewSrc(src)
      props.setNewImage(src)
    } catch {
      event.target.value = null
      setConnection(false)
    } finally {
      setPending(false)
    }
  }

  const onFileRemove = () => {
    setPreviewSrc('')
    props.setNewImage('')
    inputFileRef.current.value = null
  }

  const imagePreview = () => {
    if (pending) {
      return (
        <img className={styles.imagePreview} src={preloader} alt="preview" />
      )
    }
    if (!previewSrc) {
      return (
        <img
          className={styles.imagePreview}
          src={noImageSelected}
          alt="preview"
        />
      )
    }

    return (
      <img className={styles.imagePreview} src={previewSrc} alt="preview" />
    )
  }

  if (!connection) {
    return <InternetConnectionProblem />
  }

  return (
    <>
      <div className={styles.imagePreviewContainer}>
        <div
          style={{ display: previewSrc ? 'block' : 'none' }}
          className={styles.removeImg}
        >
          <div className={styles.removeImgBtn} onClick={onFileRemove} />
        </div>
        {imagePreview()}
      </div>
      <div className={styles.errorMessage}>{errorText}</div>
      <input
        ref={inputFileRef}
        className={styles.uploadImgInput}
        type="file"
        onChange={onFileChange}
        accept="image/x-png,image/gif,image/jpeg"
      />
    </>
  )
}

export default UploadImgForm
