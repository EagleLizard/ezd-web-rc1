
import './vert-sep.css';

type VertSepProps = {
  className?: string;
} & {};
export function VertSep(props: VertSepProps) {
  let classNames: string[] = [
    'vert-sep',
  ];
  if(props.className !== undefined) {
    classNames.push(props.className);
  }
  let className = classNames.join(' ');
  return (
    <div className={className}/>
  );
}
