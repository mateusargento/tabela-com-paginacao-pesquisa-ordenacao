import { useEffect, useState } from 'react'
import { Badge, Button, Form, FormCheck, Modal, Pagination, Table } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faEdit, faMoon, faSort, faSortDown, faSortUp, faSun, faTrash } from '@fortawesome/free-solid-svg-icons'
import json from '../mock/mockData.json'
import style from './TableComponent.module.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import toast from 'react-hot-toast'

export default function TableComponent() {
  const [idInput, setIDInput] = useState<number | undefined>()
  const [nameInput, setNameInput] = useState<string>('')
  const [searchInput, setSearchInput] = useState<string>('')
  const [statusInput, setStatusInput] = useState<'Active' | 'Inactive'>('Active')
  const [surnameInput, setSurnameInput] = useState<string>('')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  // Table
  const [data, _] = useState<Array<any>>(json) // Guarda o dado original vindo por JSON
  const [dataKeys, __] = useState<string[]>(Object.keys(json[0]))
  const [dataFormatted, setDataFormatted] = useState<Array<any>>(json) // Guarda o dado manipulado por filtro, ordenação ou paginação
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>()
  const [sortColumn, setSortColumn] = useState<{ column: string, orderBy: 'asc' | 'desc' }>({
    column: '',
    orderBy: 'desc',
  })
  const [tableData, setTableData] = useState<Array<any>>([]) // O que é mostrado na tabela
  const [tableStyle, ___] = useState<{ type: string, columnsSize: string[] }>({
    type: 'd-flex',
    columnsSize: ['col-1', 'col-2', 'col-4', 'col-4', 'col-1']
  })
  // Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [modalData, setModalData] = useState<{ title: string, isAllInputsDisabled: boolean, }>({
    title: '',
    isAllInputsDisabled: false
  })
  // Paginação
  const [currentPage, setCurrentPage] = useState<number>()
  const toastTheme: any = theme == 'dark'
    ? {
      style: {
        background: '#212529',
        color: '#f0f0f0',
      },
    }
    : {}


  useEffect(() => {
    // Faz a paginação inicial
    handlePagination(1)
  }, [])


  function handleButtonAction(action: 'add' | 'edit' | 'delete'): void {
    // Personaliza o modal conforme o botão selecionado
    switch (action) {
      case 'add':
        setModalData({
          title: 'Add',
          isAllInputsDisabled: false,
        })

        // Dados para os inputs do modal
        setIDInput(undefined)
        setNameInput('')
        setSurnameInput('')
        setStatusInput('Active')

        // Remove qualquer index anterior para o formulário aparecer vazio
        setSelectedIndex(undefined)
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
        })

        // Dados para os inputs do modal
        setIDInput(tableData[selectedIndex].id)
        setNameInput(tableData[selectedIndex].name)
        setSurnameInput(tableData[selectedIndex].surname)
        setStatusInput(tableData[selectedIndex].status)
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
        })

        // Dados para os inputs do modal
        setIDInput(tableData[selectedIndex].id)
        setNameInput(tableData[selectedIndex].name)
        setSurnameInput(tableData[selectedIndex].surname)
        setStatusInput(tableData[selectedIndex].status)
        break
    }

    setIsModalOpen(true)
  }


  // Paginação
  const rowsPerPage = 10
  function paginationItens(): JSX.Element[] {
    if (dataFormatted.length <= 0) return []

    let paginationItens: Array<JSX.Element> = []
    //Divide a quantidade de dados pelo linhas por página na tabela
    const totalPages: number = Math.ceil((dataFormatted.length / rowsPerPage))

    // Gera os botões da paginação
    for (let i: number = 1; i <= totalPages; i++) {
      paginationItens.push(<Pagination.Item
        onClick={() => handlePagination(i)}
        active={currentPage == i && true}
        key={i}
      >
        {i}
      </Pagination.Item>)
    }

    return paginationItens
  }
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
            <Button variant='primary' onClick={() => handleButtonAction('add')} className={style.button}>
              <FontAwesomeIcon icon={faAdd} className={style.buttonsIcon} />
              Add
            </Button>
            <Button variant='primary' onClick={() => handleButtonAction('edit')} className={style.button}>
              <FontAwesomeIcon icon={faEdit} className={style.buttonsIcon} />
              Edit
            </Button>
            <Button variant='danger' onClick={() => handleButtonAction('delete')} className={style.button}>
              <FontAwesomeIcon icon={faTrash} className={style.buttonsIcon} />
              Delete
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className={style.table}>
          <Table responsive hover style={{ marginBottom: 0 }} >
            <thead>
              <tr className={tableStyle.type}>
                <th className={tableStyle.columnsSize[0]}>#</th>
                {
                  dataKeys.map((key: string, index: number) => {
                    return <th
                      className={tableStyle.columnsSize[index + 1]}
                      onClick={() => handleSort(key)}
                      key={index}
                    >
                      <div className={style.tableThContent}>
                        {/* Title */}
                        {key}

                        {/* Icons */}
                        <div className={style.tableThIcons}>
                          <FontAwesomeIcon
                            icon={faSort}
                            className={style.tableThIconsSortIcon}
                            style={{
                              color: '#8a8a8a',
                              opacity: sortColumn!.column !== key ? '1' : '0'
                            }} />
                          <FontAwesomeIcon
                            icon={faSortUp}
                            className={style.tableThIconsSortIcon}
                            style={{
                              opacity: (sortColumn.column == key && sortColumn.orderBy == 'asc') ? '1' : '0'
                            }} />
                          <FontAwesomeIcon
                            icon={faSortDown}
                            className={style.tableThIconsSortIcon}
                            style={{
                              opacity: (sortColumn.column == key && sortColumn.orderBy == 'desc') ? '1' : '0'
                            }} />
                        </div>
                      </div>
                    </th>
                  }
                  )
                }
              </tr>
            </thead>

            <tbody>
              {
                tableData.map((item: any, index: number) => {
                  return (
                    <tr
                      className={tableStyle.type}
                      onClick={() => handleSelectTableRow(index)}
                      key={index}
                    >
                      <td className={tableStyle.columnsSize[0]}>
                        <FormCheck type='radio' id={index.toString()} name='tableItem' />
                      </td>
                      {
                        dataKeys.map((key: string, index: number) => <td
                          className={tableStyle.columnsSize[index + 1]}
                          key={index}
                        >
                          {item[key].toString()}
                        </td>)
                      }
                      {/* <td>
                        {
                          item.status == 'Active'
                            ? <Badge bg='success'>Active</Badge>
                            : <Badge bg='danger'>Inactive</Badge>
                        }
                      </td> */}
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        <div className={style.paginationContent}>
          <Pagination className={style.pagination}>
            <Pagination.First
              disabled={currentPage == 1 ? true : false}
              onClick={() => handlePagination(1)} />
            <Pagination.Prev
              disabled={currentPage == 1 ? true : false}
              onClick={() => handlePagination(currentPage! - 1)}
            />
            {paginationItens()}
            <Pagination.Next
              disabled={currentPage == Math.ceil(dataFormatted.length / rowsPerPage) ? true : false}
              onClick={() => handlePagination(currentPage! + 1)}
            />
            <Pagination.Last
              disabled={currentPage == Math.ceil(dataFormatted.length / rowsPerPage) ? true : false}
              onClick={() => handlePagination(Math.ceil(dataFormatted.length / rowsPerPage))} />
          </Pagination>
        </div>

        {/* Modal */}
        <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} data-bs-theme={theme}>
          <Modal.Header closeButton>
            <Modal.Title>
              <span className={style.modalTitle}>{modalData.title}</span>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
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
                  value={idInput}
                  onChange={(e) => setIDInput(parseInt(e.target.value))}
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
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
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
                  value={surnameInput}
                  onChange={(e) => setSurnameInput(e.target.value)}
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
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value as 'Active' | 'Inactive')}
                  disabled={modalData.isAllInputsDisabled}
                >
                  <option value={'Active'}>Active</option>
                  <option value={'Inactive'}>Inactive</option>
                </Form.Select>
              </div>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant='secondary'
              onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button variant='primary'
              onClick={() => {
                setIsModalOpen(false)
                toast.success('Action completed',
                  toastTheme
                )
              }}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    </main>
  )
}
