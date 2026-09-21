import axios from 'axios'; 
import { ChangeEvent, useState } from 'react' 

// Aquí iría un tipo "UploadStatus"


const [file, setFile] = useState(null)
const [status, setStatus] = useState("idle")
const [uploadProgress, setUploadProgress] = useState(0)


// Al ocurrir un evento en el DOM, React automáticamente crea un objeto
// SyntheticEvent que representa lo que sucedió. {nombre_del_evento}.target 
// representa el elemento del DOM en el que sucedió.
function handleFileChange(uploadEvent) { // e es el evento 
  if (uploadEvent.target.files) {
    setFile(uploadEvent.target.files(0))
  }
}

function handleFileUpload() {
  if (!file) return; 

  setStatus('uploading');
  setUploadProgress(0)

  let formData = new FormData(); 
  formData.append("file", file)

  try {
    // Aquí ocurriría el envío a la API
  }

  
}

// Acá tendría que hacer un backend, capaz lo hago con python para hacerlo más rápido
