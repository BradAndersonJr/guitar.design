import { useState } from 'react'

export const useFileImport = () => {
  const [importedFile, setImportedFile] = useState<File | null>(null)

  const importFile = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.guitar' // Added .guitar

    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setImportedFile(file)
        // Here you can add logic to process the imported file
        console.log('Imported file:', file.name)
      }
    }

    input.click()
  }

  return { importFile, importedFile }
}