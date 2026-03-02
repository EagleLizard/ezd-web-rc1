
import './ezd-modal.css';

import { FaX } from 'react-icons/fa6';
import { useEffect, useRef } from 'react';

import { EzdIconButton } from '../ezd-icon-button/ezd-icon-button';

type EzdModalProps = {
  show?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClose?: () => void;
} & {};
export function EzdModal(props: EzdModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  let classNames = [ 'ezd-modal' ];
  if(props.className !== undefined && props.className.trim().length > 0) {
    classNames.push(props.className);
  }

  useEffect(() => {
    if(props.show) {
      dialogRef.current?.showModal();
    } else {
      handleClose();
    }
  }, [ props.show ]);

  return (
    <dialog
      className={classNames.join(' ')}
      ref={(ref) => {
        dialogRef.current = ref;
      }}
      onClose={handleClose}
    >
      <div className="modal-head">
        <EzdIconButton
          className="close-btn"
          onClick={handleClose}
        >
          <FaX/>
        </EzdIconButton>
      </div>
      <div className="modal-body">
        {props.children}
      </div>
    </dialog>
  );

  function handleClose() {
    props.onClose?.();
    dialogRef.current?.close();
  }
}
