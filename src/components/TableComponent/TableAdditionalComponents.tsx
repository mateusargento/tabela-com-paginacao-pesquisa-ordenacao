import { Button, FormCheck, Modal, Pagination } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition, faAdd, faEdit, faEye, faFileExcel, faPrint, faSort, faSortDown, faSortUp, faTrash } from '@fortawesome/free-solid-svg-icons'
import style from './TableComponent.module.css'

// ---- Action Buttons ----
export type ButtonActionType = {
  handleButtonAction: (action: 'add' | 'edit' | 'delete' | 'view' | 'print' | 'excel') => void
  type: 'add' | 'delete' | 'edit' | 'view' | 'print' | 'excel'
  variant: string
  disabled?: boolean
  title?: string
}
/**
 * Cria um botão de ação dos tipos "Add", "Edit", "Delete" ou "View".
 * 
 * @property {'add' | 'delete' | 'edit' | 'view'} type Qual ação ele realizará ao abrir o modal.
 * @property {string} variant Estilização do botão com os padrões estabelecidos pelo Bootstrap. As opções são: "primary", "secondary", "success", "warning", "danger", "info", "light", "dark" e "link".
 * @property {boolean} disabled Define se o botão estará desabilitado ou não. Se não for definido, estará habilitado.
 * @property {string} title Define o que será mostrado como texto do botão.
 */
export function ButtonAction({ disabled, handleButtonAction, title, type, variant }: ButtonActionType) {
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
    case 'print':
      icon = faPrint
      break
    case 'excel':
      icon = faFileExcel
      break
    default:
      icon = faAdd
      break
  }

  return (
    <Button variant={variant} onClick={() => handleButtonAction(type)} className={style.button} disabled={disabled ?? false}>
      <FontAwesomeIcon icon={icon}
        className={style.buttonsIcon}
      />
      {title ?? `${type[0].toUpperCase()}${type.substring(1)}`}
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
/**
 * Modal para realizar as funcionalidades dos botões de ver, adicionar, editar e excluir dados.
 * 
 * @property {function} confirmActionModal Ação do botão "Confirm" no modal.
 * @property {boolean} isModalOpen Controla a abertura e fechamento do modal.
 * @property {Object} modalData Dados para preencher e personalizar o modal.
 * @property {any} setIsModalOpen Altera o valor do hook "isModalOpen".
 * @property {string} theme Define o tema do modal entre claro ou escuro.
 */
export function ModalComponent(
  { children, confirmActionModal, isModalOpen, modalData, setIsModalOpen, theme }: ModalParams
) {
  return (
    <div>
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
/**
 * Paginação da tabela principal.
 * 
 * @property {function} handlePagination Função que realiza as tarefas da paginação.
 * @property {number} currentPage Página atual da tabela principal.
 * @property {any[]} dataFormatted Dados formatados com paginação e formatados ou não com ordenação e pesquisa para preencher a tabela.
 * @property {number} rowsPerPage Número de registros por página na tabela principal.
 */
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
    //Divide a quantidade de dados por linhas por página na tabela
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
/**
 * Faz a função da tag "th" com personalizações.
 * 
 * @property {string} columnKey Identificador único da tag. A key do JSON que ela representa.
 * @property {string} columnSize Tamanho da coluna com a padronização do Bootstrap. As opções são: "col-1", "col-2", "col-3", "col-4", "col-5", "col-6", "col-7", "col-8", "col-9", "col-10", "col-11" e "col-12".
 * @property {function} handleSort Responsavel por ordenar a tabela pela coluna escolhida de forma crescente ou decrescente.
 * @property {Object} sortColumn Define por qual coluna a ordenação será realizada e se será em ordem crescente ou decrescente.
 * @property {string} title Título da coluna.
 */
export function TableHead({ columnKey, columnSize, handleSort, sortColumn, title }: TableHeadParams) {
  /*
    O parâmetro "columnSize" é formado por "col-1", "col-2" assim por diante até o número 12
    A variável "columnSizeWidth" recebe o valor que vem depois do termo "col-" que é multiplicado por 10 na variável "maxStringSize", formando um limitador de caracteres.
    Se o número de caracteres enviado no parâmetro "title" ultrapassar o limite do cálculo anterior, faz uma quebra na string e acrescente reticências (...) ao final
  */
  const columnSizeWidth = parseInt(columnSize.split('-')[1])
  const maxStringSize = 10 * columnSizeWidth
  const titleFormatted = title.length > maxStringSize ? `${title.substring(0, maxStringSize)}...` : title

  return (
    <th
      className={columnSize}
      onClick={() => handleSort(columnKey)}
      key={columnKey}
    >
      <div className={style.tableThContent}>
        {/* Title */}
        {titleFormatted}

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
/**
 * Input radio para selecionar uma linha na tabela principal.
 * 
 * @property {string} columnSize Tamanho da coluna com a padronização do Bootstrap. As opções são: "col-1", "col-2", "col-3", "col-4", "col-5", "col-6", "col-7", "col-8", "col-9", "col-10", "col-11" e "col-12".
 * @property {number} index Index que representa a linha da tabela principal.
 */
export function TableDataInput({ columnSize, index }: { columnSize: string, index: number }) {
  return (
    <td className={columnSize}>
      <FormCheck type='radio' id={index!.toString()} name='tableItem' />
    </td>
  )
}
/**
 * Faz a função da tag "td" com personalizações.
 * 
 * @property {string} columnSize Tamanho da coluna com a padronização do Bootstrap. As opções são: "col-1", "col-2", "col-3", "col-4", "col-5", "col-6", "col-7", "col-8", "col-9", "col-10", "col-11" e "col-12".
 */
export function TableData({ children, columnSize }: TableDataParams) {
  return (
    <td className={columnSize}>{children}</td>
  )
}
