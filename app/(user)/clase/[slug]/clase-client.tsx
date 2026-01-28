{/* Video Player Section */}
      <section className="bg-black py-4 md:py-6 lg:py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          {classData.vimeo_id ? (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border shadow-sm">
              <iframe
                id="vimeo-player"
                src={`https://player.vimeo.com/video/${classData.vimeo_id}?title=0&byline=0&portrait=0&color=000000`}
                className="absolute top-0 left-0 w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border shadow-sm bg-muted">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-muted-foreground text-center px-4">No hay video disponible</p>
              </div>
            </div>
          )}
        </div>
      </section>
