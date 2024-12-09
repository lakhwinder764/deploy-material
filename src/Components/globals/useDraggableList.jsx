import { useState } from 'react'

const useDraggableList = initialItems => {
  const [items, setItems] = useState(initialItems)
  const [draggingIndex, setDraggingIndex] = useState(null)

  // Handle the drag start
  const handleDragStart = index => {
    setDraggingIndex(index)
  }

  // Handle drag over (
  const handleDragOver = e => {
    e.preventDefault()
  }

  // Handle the drop action
  const handleDrop = index => {
    if (draggingIndex === null) return

    const reorderedItems = [...items]
    const [movedItem] = reorderedItems.splice(draggingIndex, 1)

    reorderedItems.splice(index, 0, movedItem)

    setItems(reorderedItems) // Update the state with reordered items
    setDraggingIndex(null) // Reset dragging index
  }

  return {
    items,
    handleDragStart,
    handleDragOver,
    handleDrop
  }
}

export default useDraggableList
