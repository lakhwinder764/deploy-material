import { useEffect, useState } from 'react'

import classnames from 'classnames'

import ReactQuill from 'react-quill'
import { styled } from '@mui/material/styles'
import { Box, Divider, IconButton } from '@mui/material'

import { useEditor, EditorContent } from '@tiptap/react'

import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import 'react-quill/dist/quill.snow.css'

import '@/libs/styles/tiptapEditor.css'
import CustomIconButton from '@/@core/components/mui/IconButton'

const EditorToolbar = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <div className='flex flex-wrap gap-x-3 gap-y-1 pbs-5 pbe-4 pli-5'>
      <IconButton
        {...(editor.isActive('bold') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <i className={classnames('ri-bold', { 'text-textSecondary': !editor.isActive('bold') })} />
      </IconButton>
      <CustomIconButton
        {...(editor.isActive('underline') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <i className={classnames('ri-underline', { 'text-textSecondary': !editor.isActive('underline') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('italic') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <i className={classnames('ri-italic', { 'text-textSecondary': !editor.isActive('italic') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('strike') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <i className={classnames('ri-strikethrough', { 'text-textSecondary': !editor.isActive('strike') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'left' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <i className={classnames('ri-align-left', { 'text-textSecondary': !editor.isActive({ textAlign: 'left' }) })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'center' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <i
          className={classnames('ri-align-center', {
            'text-textSecondary': !editor.isActive({ textAlign: 'center' })
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'right' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <i
          className={classnames('ri-align-right', {
            'text-textSecondary': !editor.isActive({ textAlign: 'right' })
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'justify' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      >
        <i
          className={classnames('ri-align-justify', {
            'text-textSecondary': !editor.isActive({ textAlign: 'justify' })
          })}
        />
      </CustomIconButton>
    </div>
  )
}

const TextEditor = ({
  index,
  text,
  handleInputChange = () => {},
  setTextValue = () => {},
  value,
  onChange,
  onKeyPress,
  placeholder,
  quilleditor,
  simpleeditor,
  mkeditor,
  width
}) => {
  const [values, setValues] = useState(value)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write something here...'
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline
    ],
    content: text,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()

      handleContentChange(html)
      setTextValue(html)
    }
  })

  // Sync the initial value passed into the component
  useEffect(() => {
    setValues(value)
  }, [value])

  // Define the modules for the toolbar
  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  }

  const minimizedModules = {
    toolbar: [
      [{ size: [] }, { color: [] }, { background: [] }, { align: [] }],

      [{ header: '1' }, { header: '2' }, { font: [] }],
      [],

      //   [],
      ['clean']
    ]
  }

  const minimizedFormats = [
    'header',
    'font',

    // 'size',
    'bold',
    'italic',
    'underline',

    // 'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'align',
    'color'

    // 'background',
    // 'link',
    // 'image',
    // 'video'
  ]

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'align',
    'color',
    'background',
    'link',
    'image',
    'video'
  ]

  // Handle content changes
  const handleChange = (content, delta, source, editor) => {
    setValues(content) // Update the internal state
    onChange(content) // Pass the content back to the parent component
  }

  const handleContentChange = newContent => {
    // setEditorContent(newContent);
    handleInputChange(index, newContent)
  }

  return quilleditor ? (
    <div style={{ overflow: 'auto' }}>
      <ReactQuill
        theme='snow'
        value={values}
        onChange={handleChange}
        modules={simpleeditor ? minimizedModules : modules}
        formats={simpleeditor ? minimizedFormats : formats}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
      />
    </div>
  ) : mkeditor ? (
    <h5>Editor coming soon ... </h5>
  ) : (
    <textarea
      style={{
        width: width ?? '75vw',
        border: '1px solid #c2c3c9'
      }}
      className='bs-[115px] overflow-y-auto flex '
      value={value}
      onChange={onChange}
    />
  )
}

export default TextEditor
