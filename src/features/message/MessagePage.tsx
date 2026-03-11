import { PAGE_TITLES } from '@/shared/constant/seo'
import useDocumentTitle from '@/shared/hooks/useDocumentTitle'
import { Mail } from 'lucide-react'


const MessagePage = () => {
  useDocumentTitle(PAGE_TITLES.MESSAGES)
  return (
     <div className="min-h-screen bg-(--color-bg) flex items-center justify-center px-6">
      <div className="text-center">
        <Mail size={48} className="text-[#137fec] mx-auto" />
        <h1 className="mt-4 text-3xl font-bold text-(--color-text-primary)">
          Fitur Message
        </h1>
        <p className="mt-2 text-(--color-text-muted)">
          Kami sedang mengerjakan fitur ini. Segera hadir!
        </p>
      </div>
    </div>
  )
}

export default MessagePage
