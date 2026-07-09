export default function Container({ children, className = '', as: Tag = 'div' }) {
  return <Tag className={`w-full max-w-7xl mx-auto px-6 md:px-10 ${className}`}>{children}</Tag>
}