{/* Video Player Section */}
      <section className="bg-black py-0 md:py-6 lg:py-8">
        <div className="max-w-6xl mx-auto px-0 md:px-4 lg:px-6">
          {classData.vimeo_id ? (
            <div className="relative w-full aspect-video overflow-hidden md:rounded-lg border-0 md:border md:border-border md:shadow-sm">
              <iframe
                id="vimeo-player"
                src={`https://player.vimeo.com/video/${classData.vimeo_id}?title=0&byline=0&portrait=0&color=000000`}
                className="absolute top-0 left-0 w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="relative w-full aspect-video overflow-hidden md:rounded-lg border-0 md:border md:border-border md:shadow-sm bg-muted">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground text-center px-4">No hay video disponible</p>
              </div>
            </div>
          )}
        </div>
      </section>
