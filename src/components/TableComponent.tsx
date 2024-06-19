import { useEffect, useState } from 'react'
import { Badge, Button, Form, FormCheck, Modal, Pagination, Table, Toast } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faEdit, faMoon, faSun, faTrash } from '@fortawesome/free-solid-svg-icons'
import json from '../mock/mockData.json'
import style from './TableComponent.module.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import toast from 'react-hot-toast'

export default function TableComponent() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [idInput, setIDInput] = useState<number | undefined>()
  const [nameInput, setNameInput] = useState<string>('')
  const [surnameInput, setSurnameInput] = useState<string>('')
  const [statusInput, setStatusInput] = useState<'Active' | 'Inactive'>('Active')
  const [searchInput, setSearchInput] = useState<string>('')
  // Table
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>()
  const [data, setData] = useState<Array<any>>(json)
  const [tableData, setTableData] = useState<Array<any>>([])
  // Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [modalData, setModalData] = useState<{
    title: string,
    isAllInputsDisabled: boolean,
  }>({
    title: '',
    isAllInputsDisabled: false
  })
  // Paginação
  const [currentPage, setCurrentPage] = useState<number>()

  useEffect(() => {
    // Faz a paginação inicial
    handlePagination(1)
  }, [])

  // Paginação
  const rowsPerPage = 10
  function paginationItens(): JSX.Element[] {
    if (data.length <= 0) return []

    let paginationItens: Array<JSX.Element> = []

    //Divide a quantidade de dados pelo linhas por página na tabela
    const totalPages = Math.ceil((data.length / rowsPerPage))

    // Gera os botões da paginação
    for (let i = 1; i <= totalPages; i++) {
      paginationItens.push(<Pagination.Item
        onClick={() => handlePagination(i)}
        active={currentPage == i && true}
      >
        {i}
      </Pagination.Item>)
    }

    return paginationItens
  }
  function handlePagination(page: number): void {
    if (data.length <= 0) return
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
    const firstRowIndex = ((rowsPerPage * page) - rowsPerPage)
    const lastRowIndex = ((rowsPerPage * page))

    const result = data.slice(firstRowIndex, lastRowIndex)
    setTableData(result)
    setCurrentPage(page)
  }

  function handleSelect(id: string): void {
    // Set for enviado o id corretamente
    if (!id) return

    // Seleciona a linha
    document.getElementById(id)!.click()
    setSelectedIndex(parseInt(id) - 1)
  }

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
        if (selectedIndex == undefined) return

        setModalData({
          title: 'Edit',
          isAllInputsDisabled: false,
        })

        // Dados para os inputs do modal
        setIDInput(data[selectedIndex].id)
        setNameInput(data[selectedIndex].name)
        setSurnameInput(data[selectedIndex].surname)
        setStatusInput(data[selectedIndex].status)
        break
      case 'delete':
        // Não permite continuar sem que nenhuma linha da tabela tenha sido selecionada
        if (selectedIndex == undefined) return

        setModalData({
          title: 'Delete',
          isAllInputsDisabled: true,
        })

        // Dados para os inputs do modal
        setIDInput(data[selectedIndex].id)
        setNameInput(data[selectedIndex].name)
        setSurnameInput(data[selectedIndex].surname)
        setStatusInput(data[selectedIndex].status)
        break
    }

    setIsModalOpen(true)
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
            checked={theme == 'dark' ? true : false}
            id='theme'
            onClick={() => handleTheme()}
          />
          <Form.Label htmlFor='theme'>
            <FontAwesomeIcon icon={faMoon} width={'12px'} />
          </Form.Label>
        </div>

        <div className={style.inputs}>
          {/* Search Input */}
          <Form className={style.search}>
            <Form.Label htmlFor='searchInput'>Search</Form.Label>
            <Form.Control
              type='text'
              id='searchInput'
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className={style.searchInput}
            />
          </Form>

          {/* Buttons */}
          <div className={style.buttons}>
            <Button variant='primary' onClick={() => handleButtonAction('add')}>
              <FontAwesomeIcon icon={faAdd} style={{ marginRight: 8 }} className={style.faIcon} />
              Add
            </Button>
            <Button variant='primary' onClick={() => handleButtonAction('edit')}>
              <FontAwesomeIcon icon={faEdit} style={{ marginRight: 8 }} className={style.faIcon} />
              Edit
            </Button>
            <Button variant='danger' onClick={() => handleButtonAction('delete')}>
              <FontAwesomeIcon icon={faTrash} style={{ marginRight: 8 }} className={style.faIcon} />
              Delete
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className={style.table}>
          <Table responsive hover className={style.tableComponent}>
            <thead>
              <tr className='d-flex'>
                <th className='col-1'>#</th>
                <th className='col-1'>ID</th>
                <th className='col-4'>Name</th>
                <th className='col-4'>Surname</th>
                <th className='col-2'>Status</th>
              </tr>
            </thead>
            <tbody>
              {
                tableData.map((item, index) => {
                  return (
                    <tr
                      className='d-flex'
                      onClick={() => handleSelect(item.id.toString())}
                      key={index}
                    >
                      <td className='col-1'>
                        <FormCheck type='radio' id={item.id.toString()} name='tableItem' />
                      </td>
                      <td className='col-1'>{item.id.toString()}</td>
                      <td className='col-4'>{item.name}</td>
                      <td className='col-4'>{item.surname}</td>
                      <td className='col-2'>
                        {
                          item.status == 'Active'
                            ? <Badge bg='success'>Active</Badge>
                            : <Badge bg='danger'>Inactive</Badge>
                        }
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>

          {/* Pagination */}
          <div className={style.pagination}>
            <Pagination>
              <Pagination.First
                disabled={currentPage == 1 ? true : false}
                onClick={() => handlePagination(1)} />
              <Pagination.Prev
                disabled={currentPage == 1 ? true : false}
                onClick={() => handlePagination(currentPage! - 1)}
              />
              {paginationItens()}
              <Pagination.Next
                disabled={currentPage == Math.ceil(data.length / rowsPerPage) ? true : false}
                onClick={() => handlePagination(currentPage! + 1)}
              />
              <Pagination.Last
                disabled={currentPage == Math.ceil(data.length / rowsPerPage) ? true : false}
                onClick={() => handlePagination(Math.ceil(data.length / rowsPerPage))} />
            </Pagination>
          </div>
        </div>

        <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} data-bs-theme={theme}>
          <Modal.Header closeButton>
            <Modal.Title>{modalData.title}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form>
              {/* ID */}
              <Form.Label htmlFor='id'>ID</Form.Label>
              <Form.Control
                type='number'
                id='id'
                value={idInput}
                onChange={(e) => setIDInput(parseInt(e.target.value))}
                disabled
              />

              {/* Name */}
              <Form.Label htmlFor='name'>Name</Form.Label>
              <Form.Control
                type='text'
                id='name'
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                disabled={modalData.isAllInputsDisabled}
              />

              {/* Surname */}
              <Form.Label htmlFor='surname'>Surname</Form.Label>
              <Form.Control
                type='text'
                id='surname'
                value={surnameInput}
                onChange={(e) => setSurnameInput(e.target.value)}
                disabled={modalData.isAllInputsDisabled}
              />

              {/* Status */}
              <Form.Label htmlFor='status'>Status</Form.Label>
              <Form.Select
                id='status'
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value as 'Active' | 'Inactive')}
                disabled={modalData.isAllInputsDisabled}
              >
                <option value={'Active'}>Active</option>
                <option value={'Inactive'}>Inactive</option>
              </Form.Select>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant='secondary' onClick={() => setIsModalOpen(false)}>Close</Button>
            <Button variant='primary' onClick={() => {
              setIsModalOpen(false)
              toast.success('Action completed',
                theme == 'dark'
                  ? {
                    style: {
                      background: '#212529',
                      color: '#f0f0f0',
                    },
                  }
                  : {}
              )
            }}>Confirm</Button>
          </Modal.Footer>
        </Modal>

      </div>
    </main>
  )
}
