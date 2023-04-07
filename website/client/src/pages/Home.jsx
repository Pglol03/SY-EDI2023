import React, { useState, useEffect } from 'react'
import { Loader, Card, FormField } from '../components'

const Home = () => {
    const [loading, setLoading] = useState(false);
    const [presentation, setpresentation] = useState(null);
    const [searchTemplate, setSearchTemplate] = useState('abs')

  return (
    <section className="max-w-7xl mx-auto">
        <div>
             <h1 className="font-extrabold text-[#222328] text-[32px]">A Few Example Templates</h1>
             <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
                Browse through a collection of templates supported by PresentAI
             </p>
        </div>

        <div className="mt-16">
            <FormField/>
        </div>

        <div className="mt-10">
            {loading ? (
                <div className="fless justify-center items-center">
                    <Loader/>
                </div>
            ):(
                <>
                {searchTemplate && (
                    <h2 className="font-medium text-[#666e75] text-xl mb -3">
                    Showing Results for <span className="text-[#22328]">{searchTemplate}</span>
                    </h2>
                )}
                <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">

                </div>
                </>
            )}
        </div>
    </section>
  )
}

export default Home