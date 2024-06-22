import { Button, FormCheck, Modal, Pagination } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition, faAdd, faEdit, faEye, faSort, faSortDown, faSortUp, faTrash } from '@fortawesome/free-solid-svg-icons'
import style from './TableComponent.module.css'

// ---- Action Buttons ----
export type ButtonActionType = {
  handleButtonAction: (action: 'add' | 'edit' | 'delete' | 'view') => void
  type: 'add' | 'delete' | 'edit' | 'view'
  variant: string
}
export function ButtonAction({ handleButtonAction, type, variant }: ButtonActionType) {
  let icon: IconDefinition
  switch (type) {
    case 'add':
      icon = faAdd
      break
    case 'delete':
      icon = faTrash
      break
    case 'edit':
      icon = faEdit
      break
    case 'view':
      icon = faEye
      break
    default:
      icon = faAdd
      break
  }

  return (
    <Button variant={variant} onClick={() => handleButtonAction(type)} className={style.button}>
      <FontAwesomeIcon icon={icon}
        className={style.buttonsIcon}
      />
      {`${type[0].toUpperCase()}${type.substring(1)}`}
    </Button>
  )
}

// ---- Modal ----
export type ModalParams = {
  children: any
  confirmActionModal: () => void
  isModalOpen: boolean,
  modalData: { title: string, isAllInputsDisabled: boolean, isConfirmButtonDisabled: boolean },
  setIsModalOpen: any,
  theme: string,
}
export function ModalComponent(
  { children, confirmActionModal, isModalOpen, modalData, setIsModalOpen, theme }: ModalParams
) {
  return (
    <div>
      {/* Modal */}
      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} data-bs-theme={theme}>
        <Modal.Header closeButton>
          <Modal.Title>
            <span className={style.modalTitle}>{modalData.title}</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {children}
        </Modal.Body>

        <Modal.Footer>
          <Button variant='secondary'
            onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
          <Button variant='primary'
            onClick={() => confirmActionModal()}
            style={{ display: modalData.isConfirmButtonDisabled ? 'none' : '' }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}


// ---- Pagination ----
export type PaginationItemsParams = {
  handlePagination: (page: number) => void,
  currentPage: number,
  dataFormatted: any[],
  rowsPerPage: number,
}
export function PaginationItems({
  handlePagination,
  currentPage,
  dataFormatted,
  rowsPerPage,
}: PaginationItemsParams) {

  // Gera os botões numéricos da paginação
  function paginationItems(): JSX.Element[] {
    if (dataFormatted.length <= 0) return []

    let paginationItems: Array<JSX.Element> = []
    //Divide a quantidade de dados pelo linhas por página na tabela
    const totalPages: number = Math.ceil((dataFormatted.length / rowsPerPage))

    // Gera os botões da paginação
    for (let i: number = 1; i <= totalPages; i++) {
      paginationItems.push(<Pagination.Item
        onClick={() => handlePagination(i)}
        active={currentPage == i && true}
        key={i}
      >
        {i}
      </Pagination.Item>)
    }

    return paginationItems
  }

  return (
    <Pagination className={style.pagination}>
      <Pagination.First
        disabled={currentPage == 1 ? true : false}
        onClick={() => handlePagination(1)}
      />
      <Pagination.Prev
        disabled={currentPage == 1 ? true : false}
        onClick={() => handlePagination(currentPage! - 1)}
      />
      {paginationItems()}
      <Pagination.Next
        disabled={currentPage == Math.ceil(dataFormatted.length / rowsPerPage) ? true : false}
        onClick={() => handlePagination(currentPage! + 1)}
      />
      <Pagination.Last
        disabled={currentPage == Math.ceil(dataFormatted.length / rowsPerPage) ? true : false}
        onClick={() => handlePagination(Math.ceil(dataFormatted.length / rowsPerPage))}
      />
    </Pagination>
  )
}


// ---- Table Columns Title ----
export type TableHeadParams = {
  columnKey: string,
  columnSize: string,
  handleSort: (column: string) => void,
  sortColumn: { column: string, orderBy: 'asc' | 'desc' },
  title: string,
}
export function TableHead({ columnKey, columnSize, handleSort, sortColumn, title }: TableHeadParams) {
  return (
    <th
      className={columnSize}
      onClick={() => handleSort(columnKey)}
      key={columnKey}
    >
      <div className={style.tableThContent}>
        {/* Title */}
        {title}

        {/* Icons */}
        <div className={style.tableThIcons} style={columnKey == '#' ? { opacity: 0 } : { opacity: 1 }}>
          <FontAwesomeIcon
            icon={faSort}
            className={style.tableThIconsSortIcon}
            style={{
              color: '#8a8a8a',
              opacity: sortColumn!.column !== columnKey ? '1' : '0'
            }}
          />
          <FontAwesomeIcon
            icon={faSortUp}
            className={style.tableThIconsSortIcon}
            style={{
              opacity: (sortColumn.column == columnKey && sortColumn.orderBy == 'asc') ? '1' : '0'
            }}
          />
          <FontAwesomeIcon
            icon={faSortDown}
            className={style.tableThIconsSortIcon}
            style={{
              opacity: (sortColumn.column == columnKey && sortColumn.orderBy == 'desc') ? '1' : '0'
            }}
          />
        </div>
      </div>
    </th>
  )
}


// ---- Table Columns Data ----
export type TableDataParams = {
  children: any,
  columnSize: string
}
export function TableDataInput({ columnSize, index }: { columnSize: string, index: number }) {
  return (
    <td className={columnSize}>
      <FormCheck type='radio' id={index!.toString()} name='tableItem' />
    </td>
  )
}
export function TableData({ children, columnSize }: TableDataParams) {
  return (
    <td className={columnSize}>{children}</td>
  )
}
