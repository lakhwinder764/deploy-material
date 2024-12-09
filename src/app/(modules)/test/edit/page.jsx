'use client'
import { useEffect, useState } from 'react'

import useCategoryApi from '@/api/useCategoryApi'
import EditTest from '@/views/test/edit/EditTest'

export default function Page() {
  const { data: categoriesTableData, fetchData } = useCategoryApi()
  const [categories, setCategories] = useState([{ parent: null, children: categoriesTableData }])

  // const [categories, setCategories] = useState([{ parent: null, children: categoriesTableData }])

  console.info(categoriesTableData, 'new1')
  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    setCategories([{ parent: null, children: categoriesTableData }])
  }, [categoriesTableData])

  // const [categories, setCategories] = useState([{ parent: null, children: categoriesTableData }])
  return <EditTest categories={categories} setCategories={setCategories} categoriesTableData={categoriesTableData} />
}
