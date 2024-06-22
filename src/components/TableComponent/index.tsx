import { useEffect, useState } from 'react'
import { Badge, Form, FormCheck, Table } from 'react-bootstrap'
import { ButtonAction, ModalComponent, PaginationItems, TableData, TableDataInput, TableHead } from './TableAdditionalComponents'
import json from '../../mock/mockData.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import toast from 'react-hot-toast'
import style from './TableComponent.module.css'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function TableComponent() {
  // Configura o hook dos inputs conforme as keys vindas por JSON
  const inputsObject: Object = {}
  Object.keys(json[0]).map((key: any) => { Object.defineProperty(inputsObject, key, {}) })

  const [inputs, setInputs] = useState<any>(inputsObject)
  const [searchInput, setSearchInput] = useState<string>('')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [rowsPerPage, _____] = useState<number>(10)
  const toastTheme = theme == 'dark' ? { style: { background: '#212529', color: '#f0f0f0' } } : {}
  // ---- Table ----
  const [data, _] = useState<any[]>(json) // Guarda o dado original vindo por JSON
  const [dataKeys, __] = useState<string[]>(Object.keys(json[0]))
  const [dataFormatted, setDataFormatted] = useState<any[]>(json) // Guarda o dado manipulado por filtro, ordenação ou paginação
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>()
  const [sortColumn, setSortColumn] = useState<{ column: string, orderBy: 'asc' | 'desc' }>({
    column: '', orderBy: 'desc',
  })
  const [tableData, setTableData] = useState<any[]>([]) // O que é mostrado na tabela
  const [tableStyleType, ___] = useState<string>('d-flex flex-wrap')
  // ---- Modal ----
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [modalData, setModalData] = useState<{
    title: string, isAllInputsDisabled: boolean, isConfirmButtonDisabled: boolean,
  }>({ title: '', isAllInputsDisabled: false, isConfirmButtonDisabled: false, })
  // ---- Pagination ----
  const [currentPage, setCurrentPage] = useState<number>()


  useEffect(() => {
    // Faz a paginação inicial
    handlePagination(1)
  }, [])


  function handleButtonAction(action: 'add' | 'edit' | 'delete' | 'view'): void {
    // Personaliza o modal conforme o botão selecionado
    switch (action) {
      case 'add':
        setModalData({
          title: 'Add',
          isAllInputsDisabled: false,
          isConfirmButtonDisabled: false,
        })

        // Dados para os inputs do modal
        dataKeys.map((key: string) => {
          setInputs((value: any) => { return { ...value, [key]: '' } })
        })

        // Desmarca o "input radio" selecionado, caso haja, antes de trocar de página
        const inputsRadio: any = document.querySelectorAll('input[type=radio]')
        if (inputsRadio.length > 0) {
          for (let i = 0; i < inputsRadio.length; i++) {
            inputsRadio[i].checked = false
          }

          setSelectedIndex(undefined)
        }
        break
      case 'edit':
        // Não permite continuar sem que nenhuma linha da tabela tenha sido selecionada
        if (selectedIndex == undefined) {
          toast.error('Choose a row to edit',
            { ...toastTheme, icon: '⚠️', }
          )
          return
        }

        setModalData({
          title: 'Edit',
          isAllInputsDisabled: false,
          isConfirmButtonDisabled: false,
        })

        // Dados para os inputs do modal
        dataKeys.map((key: string) => {
          setInputs((value: any) => { return { ...value, [key]: tableData[selectedIndex][key] } })
        })
        break
      case 'delete':
        // Não permite continuar sem que nenhuma linha da tabela tenha sido selecionada
        if (selectedIndex == undefined) {
          toast.error('Choose a row to delete',
            { ...toastTheme, icon: '⚠️', }
          )
          return
        }

        setModalData({
          title: 'Delete',
          isAllInputsDisabled: true,
          isConfirmButtonDisabled: false,
        })

        // Dados para os inputs do modal
        dataKeys.map((key: string) => {
          setInputs((value: any) => { return { ...value, [key]: tableData[selectedIndex][key] } })
        })
        break
      case 'view':
        // Não permite continuar sem que nenhuma linha da tabela tenha sido selecionada
        if (selectedIndex == undefined) {
          toast.error('Choose a row to view',
            { ...toastTheme, icon: '⚠️', }
          )
          return
        }

        setModalData({
          title: 'View',
          isAllInputsDisabled: true,
          isConfirmButtonDisabled: true,
        })

        // Dados para os inputs do modal
        dataKeys.map((key: string) => {
          setInputs((value: any) => { return { ...value, [key]: tableData[selectedIndex][key] } })
        })
        break
    }

    setIsModalOpen(true)
  }


  // ---- Pagination ----
  function handlePagination(page: number): void {
    if (data.length <= 0) return

    // Desmarca o "input radio" selecionado, caso haja, antes de trocar de página
    const inputsRadio: any = document.querySelectorAll('input[type=radio]')
    if (inputsRadio.length > 0) {
      for (let i = 0; i < inputsRadio.length; i++) {
        inputsRadio[i].checked = false
      }

      setSelectedIndex(undefined)
    }

    /*
      Separa os registros em páginas
      
      Exemplo: 
      A variável "page" define a página solicitada, que neste exemplo é igual a 2
      A variável "rowsPerPage" é igual a 10.
      A variável "firstRowIndex" terá o valor ((10 * 2) - 10) = 10
      A variável "lastRowIndex" terá o valor ((10 * 2)) = 20
      A função slice separa os dados entre os indexs 10 e 20 que resultará nos indexs 10 ao 19 como resultado
    */
    const firstRowIndex: number = ((rowsPerPage * page) - rowsPerPage)
    const lastRowIndex: number = ((rowsPerPage * page))

    const result: any[] = dataFormatted.slice(firstRowIndex, lastRowIndex)
    setTableData(result)
    setCurrentPage(page)
  }


  function handleSearch(searchValue: string): void {
    if (data.length <= 0) return
    handlePagination(1)
    if (searchValue == '') {
      setDataFormatted(data)
      setTableData(data.slice(0, 10))
      return
    }

    // Busca em todas as colunas se existe algum dado relacionado ao que foi pesquisado
    const searchList = data.filter((item: any) => {
      for (let i = 0; i < dataKeys.length; i++) {
        const searchValueFormatted: string = searchValue.trim().toLowerCase()
        const itemColumnFormatted: string = item[dataKeys[i]].toString().trim().toLowerCase()

        // Pesquisa em todos os campos se em algum campo tem algum trecho com termo pesquisado
        const regExp = new RegExp(`\\b${searchValueFormatted}\\w*`, 'gi');
        const matchResult: RegExpMatchArray | null = itemColumnFormatted.match(regExp)
        if (matchResult) return item
      }
    })

    setDataFormatted(searchList)
    setTableData(searchList.slice(0, 10))
  }


  function handleSelectTableRow(index: number): void {
    // Set for enviado o id corretamente
    if (index < 0) return

    // Seleciona a linha
    document.getElementById(index.toString())!.click()
    setSelectedIndex(index)
  }


  function handleTheme(): void {
    let main: HTMLElement = document.getElementsByTagName('main')[0]

    // Muda a cor do que não é do Bootstrap
    main.style.colorScheme !== 'light'
      ? main.style.colorScheme = 'light'
      : main.style.colorScheme = 'dark'

    // Muda o tema do Bootstrap
    setTimeout(() => {
      setTheme((value) => value !== 'light' ? 'light' : 'dark')
    }, 15);
  }


  function handleSort(column: string): void {
    if (!column) return

    // Escolhe entre ordem crescente ou decrescente
    // Caso altere a coluna para ordenar, começa com ordem crescente
    const orderBy: 'asc' | 'desc' = sortColumn.column == column
      ? sortColumn.orderBy == 'asc' ? 'desc' : 'asc'
      : sortColumn.orderBy = 'asc'

    // Ordena em ordem crescente ou decrescente
    const sortResult = dataFormatted.sort((a, b) => {
      if (a[column] > b[column]) {
        return orderBy == 'asc' ? 1 : -1
      }

      if (a[column] < b[column]) {
        return orderBy == 'asc' ? -1 : 1
      }

      return 0
    })

    setSortColumn({
      column: column,
      orderBy: orderBy
    })
    setDataFormatted(sortResult)
    setTableData(sortResult.slice(0, 10))
  }


  return (
    <main data-bs-theme={theme}>
      <div className={style.content}>

        {/* Theme Switch */}
        <div className={style.theme}>
          <Form.Label htmlFor='theme'>
            <FontAwesomeIcon icon={faSun} width={'12px'} style={{ marginRight: '8px' }} />
          </Form.Label>
          <FormCheck
            type='switch'
            id='theme'
            checked={theme == 'dark' ? true : false}
            onChange={() => handleTheme()}
          />
          <Form.Label htmlFor='theme'>
            <FontAwesomeIcon icon={faMoon} width={'12px'} />
          </Form.Label>
        </div>

        <div className={style.inputsContent}>
          {/* Search Input */}
          <Form className={style.search}>
            <Form.Label htmlFor='searchInput'>Search</Form.Label>
            <Form.Control
              type='text'
              id='searchInput'
              autoComplete='off'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyUp={() => handleSearch(searchInput)}
              className={style.searchInput}
            />
          </Form>

          {/* Buttons */}
          <div className={style.buttonContent}>
            <ButtonAction variant='primary' type={'view'} handleButtonAction={handleButtonAction} />
            <ButtonAction variant='primary' type={'add'} handleButtonAction={handleButtonAction} />
            <ButtonAction variant='primary' type={'edit'} handleButtonAction={handleButtonAction} />
            <ButtonAction variant='danger' type={'delete'} handleButtonAction={handleButtonAction} />
          </div>
        </div>

        {/* Table */}
        <div className={style.table}>
          <Table hover style={{ marginBottom: 0 }} >
            <thead>
              <tr className={tableStyleType}>
                <TableHead
                  title='#'
                  columnKey='#'
                  columnSize='col-1'
                  handleSort={() => { }}
                  sortColumn={sortColumn}
                />
                <TableHead
                  title='ID'
                  columnKey='id'
                  columnSize='col-1'
                  handleSort={handleSort}
                  sortColumn={sortColumn}
                />
                <TableHead
                  title='Name'
                  columnKey='name'
                  columnSize='col-4'
                  handleSort={handleSort}
                  sortColumn={sortColumn}
                />
                <TableHead
                  title='texto muiot grande que não cabe na tela que tem espaço para mostrar o texto'
                  columnKey='surname'
                  columnSize='col-4'
                  handleSort={handleSort}
                  sortColumn={sortColumn}
                />
                <TableHead
                  title='Status'
                  columnKey='status'
                  columnSize='col-2'
                  handleSort={handleSort}
                  sortColumn={sortColumn}
                />
              </tr>
            </thead>

            <tbody>
              {
                tableData.map((item: any, index: number) => {
                  return (
                    <tr className={tableStyleType} onClick={() => handleSelectTableRow(index)} key={index}>
                      <TableDataInput index={index} columnSize={'col-1'} />
                      <TableData columnSize={'col-1'} >
                        {item.id}
                      </TableData>
                      <TableData columnSize={'col-4'} >
                        {item.name}
                      </TableData>
                      <TableData columnSize={'col-4'} >
                        {item.surname}
                      </TableData>
                      <TableData columnSize={'col-2'} >
                        {
                          item.status == 'Active'
                            ? <Badge bg='success'>Active</Badge>
                            : <Badge bg='danger'>Inactive</Badge>
                        }
                      </TableData>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        <div className={style.paginationContent}>
          <PaginationItems
            dataFormatted={dataFormatted}
            currentPage={currentPage ?? 1}
            rowsPerPage={rowsPerPage}
            handlePagination={handlePagination}
          />
        </div>

        {/* Modal */}
        <ModalComponent
          isModalOpen={isModalOpen}
          modalData={modalData}
          setIsModalOpen={setIsModalOpen}
          theme={theme}
          confirmActionModal={
            () => {
              setIsModalOpen(false)
              toast.success('Action completed',
                toastTheme
              )
            }
          }
        >
          <Form className={style.modalForm}>
            {/* ID */}
            <div>
              <Form.Label htmlFor='id' >
                <span className={style.modalFormLabel}>ID</span>
              </Form.Label>
              <Form.Control
                type='number'
                id='id'
                className={style.modalFormInput}
                // value={idInput}
                value={inputs.id}
                // onChange={(e) => setIDInput(parseInt(e.target.value))}
                onChange={(e) => setInputs((value: any) => { return { ...value, ['id']: parseInt(e.target.value) } })}
                disabled
              />
            </div>

            {/* Name */}
            <div>
              <Form.Label htmlFor='name'>
                <span className={style.modalFormLabel}>Name</span>
              </Form.Label>
              <Form.Control
                type='text'
                id='name'
                className={style.modalFormInput}
                // value={nameInput}
                value={inputs.name}
                // onChange={(e) => setNameInput(e.target.value)}
                onChange={(e) => setInputs((value: any) => { return { ...value, ['name']: e.target.value } })}
                disabled={modalData.isAllInputsDisabled}
              />
            </div>

            {/* Surname */}
            <div>
              <Form.Label htmlFor='surname'>
                <span className={style.modalFormLabel}>Surname</span>
              </Form.Label>
              <Form.Control
                type='text'
                id='surname'
                className={style.modalFormInput}
                // value={surnameInput}
                value={inputs.surname}
                // onChange={(e) => setSurnameInput(e.target.value)}
                onChange={(e) => setInputs((value: any) => { return { ...value, ['surname']: e.target.value } })}
                disabled={modalData.isAllInputsDisabled}
              />
            </div>

            {/* Status */}
            <div>
              <Form.Label htmlFor='status'>
                <span className={style.modalFormLabel}>Status</span>
              </Form.Label>
              <Form.Select
                id='status'
                className={style.modalFormInput}
                // value={statusInput}
                value={inputs.status}
                // onChange={(e) => setStatusInput(e.target.value as 'Active' | 'Inactive')}
                onChange={(e) => setInputs((value: any) => { return { ...value, ['status']: e.target.value } })}
                disabled={modalData.isAllInputsDisabled}
              >
                <option value={'Active'}>Active</option>
                <option value={'Inactive'}>Inactive</option>
              </Form.Select>
            </div>
          </Form>
        </ModalComponent>

      </div>
    </main>
  )
}
