import { Globe, ExternalLink } from "lucide-react"

export default function Website() {
  const websites = [
    {
      title: "Personal Blog",
      url: "https://blog.example.com",
      description: "My personal blog where I write about web development, technology, and more.",
      image: "/placeholder.svg?height=200&width=300&query=blog website",
    },
    {
      title: "Photography Portfolio",
      url: "https://photos.example.com",
      description: "A collection of my photography work from around the world.",
      image: "/placeholder.svg?height=200&width=300&query=photography portfolio",
    },
    {
      title: "Side Project",
      url: "https://project.example.com",
      description: "An experimental web application I built to explore new technologies.",
      image: "/placeholder.svg?height=200&width=300&query=web application",
    },
  ]

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Websites</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {websites.map((site, index) => (
          <div key={index} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-40 overflow-hidden">
              <img src={site.image || "/placeholder.svg"} alt={site.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{site.title}</h3>
              <p className="text-gray-600 mb-3">{site.description}</p>
              <a
                href={site.url}
                className="flex items-center text-blue-500 hover:text-blue-700 text-sm font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="w-4 h-4 mr-1" />
                <span className="mr-1">Visit Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
