import React, { useContext, useState } from 'react'
import firebaseApp from '../../firebaseApp'
import styles from './UploadImgForm.module.css'
import noImageSelected from '../../images/noImageSelected.png'
import preloader from '../../images/preloader.gif'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { updateData } from '../../firebaseAPIhelpers/updateDataFunctions'
import { AuthContext } from '../../Auth'

const storage = firebaseApp.storage()

const UploadImgForm: React.FC<any> = ({
  setNewImage,
  startImageSrc,
  folder,
  id,
}) => {
  const [previewSrc, setPreviewSrc] = useState(startImageSrc || '')
  const [pending, setPending] = useState(false)
  const { currentUser } = useContext(AuthContext)
  const currentUserId = currentUser.uid

  const onFileChange = async (event: any) => {
    setPending(true)
    const img = event.target.files[0]
    const ref = storage
      .ref()
      .child('images/' + folder + '/' + id + '/' + String(new Date().getTime()))
    await ref.put(img)
    const src: string = await ref.getDownloadURL().then((srcResponse) => {
      setPreviewSrc(srcResponse)
      return srcResponse
    })
    setPreviewSrc(src)
    setNewImage(src)
    setPending(false)
  }

  const removeFile = async () => {
    setPending(true)
    const ref = storage.refFromURL(previewSrc)
    ref
      .delete()
      .then(() => {
        setPreviewSrc('')
        setNewImage('')
        updateData('users', currentUserId, { imageName: null })
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      })
      .finally(() => setPending(false))
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

  return (
    <>
      <div className={styles.imagePreviewContainer}>
        <div className={styles.removeImg}>
          <FontAwesomeIcon
            className={styles.iconFontAwesome}
            icon={faTrashAlt}
            size="4x"
            onClick={removeFile}
          />
        </div>
        {imagePreview()}
      </div>
      <input
        className={styles.uploadImgInput}
        type="file"
        onChange={onFileChange}
      />
    </>
  )
}

export default UploadImgForm
