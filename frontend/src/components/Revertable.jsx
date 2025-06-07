const Revertable = () => {
  return (
      <div className="">
          <div className="gap-12 w-full  flex">
              <Link
                  to="posts"
                  className="bg-debo-yellow rounded-full px-3 py-1 text-light-grayo">
                  All posts
              </Link>
              <Link
                  to="/posts? cat=Early-Beginner"
                  className="hover:bg-debo-yellow/90 hover:text-debo-dark-blue rounded-full px-3 py-1">
                  Early Beginner
              </Link>
              <Link
                  to="/posts? cat=Beginner"
                  className="hover:bg-debo-yellow/90 rounded-full px-3 py-1">
                  Beginner
              </Link>
              <Link
                  to="/posts? cat=Junior-Developer"
                  className="hover:bg-debo-yellow/90 hover:text-debo-dark-blue rounded-full px-3 py-1">
                  Junior Developer
              </Link>
              <Link
                  to="/posts? cat=Mid-Level-Developer"
                  className="hover:bg-debo-yellow/90 hover:text-debo-dark-blue rounded-full px-3 py-1">
                  Mid-Level Developer
              </Link>
              <Link
                  to="/posts? cat=Senior-Developer"
                  className="hover:bg-debo-yellow/90  hover:text-debo-dark-blue rounded-full px-3 py-1">
                  Senior Developer
              </Link>
          </div>

          <div className="flex justify-center gap-12 w-full items-center">
              <Link
                  to="/posts? cat=Tech-Lead"
                  className="hover:bg-debo-yellow/90 hover:text-debo-dark-blue rounded-full px-3 py-1">
                  Tech Lead
              </Link>
              <Link
                  to="/posts? cat=Expert-Developer"
                  className="hover:bg-debo-yellow/90 hover:text-debo-dark-blue rounded-full px-3 py-1">
                  Expert Developer
              </Link>
              <Link
                  to="/posts? cat=Master-Developer"
                  className="hover:bg-debo-yellow/90 hover:text-debo-dark-blue rounded-full px-3 py-1">
                  Master Developer
              </Link>
          </div>
      </div>
  )
}

export default Revertable