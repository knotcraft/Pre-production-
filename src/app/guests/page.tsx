import Link from 'next/link';

export default function GuestsPage() {
  return (
    <div className="flex flex-col bg-background">
      <div className="sticky top-0 z-20 flex flex-col bg-card dark:bg-background border-b border-border">
        <div className="flex items-center p-4 justify-between">
          <Link href="/" className="text-foreground flex size-12 shrink-0 items-center">
            <span className="material-symbols-outlined text-2xl">arrow_back_ios</span>
          </Link>
          <h2 className="text-foreground text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Guest List</h2>
          <div className="flex w-12 items-center justify-end">
            <button className="flex cursor-pointer items-center justify-center rounded-lg h-12 bg-transparent text-foreground">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </div>
        <div className="px-4 pb-4">
          <div className="flex p-1 bg-muted rounded-xl">
            <button className="flex-1 py-2 text-sm font-semibold rounded-lg bg-card dark:bg-muted-foreground/20 text-primary shadow-sm">All Sides</button>
            <button className="flex-1 py-2 text-sm font-medium rounded-lg text-muted-foreground">Bride's</button>
            <button className="flex-1 py-2 text-sm font-medium rounded-lg text-muted-foreground">Groom's</button>
          </div>
        </div>
        <div className="flex flex-nowrap gap-3 px-4 pb-4 overflow-x-auto no-scrollbar">
          <div className="flex min-w-[110px] flex-1 flex-col gap-1 rounded-xl p-3 border border-border bg-card shadow-sm">
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">Total Invited</p>
            <p className="text-primary tracking-light text-xl font-bold leading-tight">150</p>
          </div>
          <div className="flex min-w-[110px] flex-1 flex-col gap-1 rounded-xl p-3 border border-border bg-card shadow-sm">
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">Confirmed</p>
            <p className="text-green-600 tracking-light text-xl font-bold leading-tight">82</p>
          </div>
          <div className="flex min-w-[110px] flex-1 flex-col gap-1 rounded-xl p-3 border border-border bg-card shadow-sm">
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">Pending</p>
            <p className="text-gray-500 tracking-light text-xl font-bold leading-tight">68</p>
          </div>
        </div>
      </div>
      <div className="bg-card dark:bg-background">
        <div className="px-4 py-3">
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm">
              <div className="text-muted-foreground flex border-none bg-muted items-center justify-center pl-4 rounded-l-xl">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-foreground focus:outline-0 focus:ring-0 border-none bg-muted h-full placeholder:text-muted-foreground px-3 text-base font-normal" placeholder="Search guests..." defaultValue="" />
            </div>
          </label>
        </div>
        <div className="flex gap-2 px-4 pb-4 overflow-x-auto no-scrollbar">
          <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary px-5 text-white shadow-sm">
            <p className="text-sm font-semibold">All Guests</p>
          </div>
          <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-muted px-5 border border-border">
            <p className="text-foreground text-sm font-medium">Confirmed</p>
          </div>
          <div className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-muted px-5 border border-border">
            <p className="text-foreground text-sm font-medium">Pending</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-24">
        <div className="px-3 py-2 flex items-center justify-between">
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Showing All Guests</p>
          <p className="text-muted-foreground text-[10px] font-medium">Sort: Recent</p>
        </div>
        <div className="flex items-center gap-4 bg-card dark:bg-muted/20 mx-2 my-1 rounded-xl px-4 min-h-[80px] py-3 justify-between shadow-sm border border-border">
          <div className="flex items-center gap-3">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 border-2 border-primary/10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB80YuFmvZ4NDOPK143RYYvLjBN4fVa48P2i8i4b4xRIfuSeFx_AqF-1CFUPQAJe3Xspm1xbjGrQ-7V4otHDJlTB9sLczOyR7MhIJImfAhYQkP5hPJg4Zc71HcH5TAJqqAxokOov-wHxcSvE2huiWGiC57Uma1uCykDh11lvU3XGARlXJ3iYmtHdnVmjrdz4a145hKOSUz36fw1RAKQGfC3SPDocmc-zXgt86vDwIzyPGKvPj5IQcNaeCiduO0gLsO8akTNgW0QXmGC")' }}></div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <p className="text-foreground text-base font-bold leading-tight">Sarah &amp; Mike Johnson</p>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pink-50 text-pink-500 border border-pink-100 uppercase">Bride</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="material-symbols-outlined text-sm text-muted-foreground">restaurant</span>
                <p className="text-muted-foreground text-xs font-normal">Party of 2 • Vegan</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">Confirmed</span>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-card dark:bg-muted/20 mx-2 my-1 rounded-xl px-4 min-h-[80px] py-3 justify-between shadow-sm border border-border">
          <div className="flex items-center gap-3">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 border-2 border-primary/10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCebxLtVmLY9BvE1mybJiDoML-K54ZEe9keFSmw_0oMzRSN0LJ8cJleg73ntQ4yxLs9ll9blA53VA6W8OGtYb-huFkMgYqLEypqwtLCcba09kTOrdOURKBioZcqNE-ku454gbQyiel-k8uGYtJWhfzaR4-GA6sVcPGpClaHrRbMJlLTDGUK8c6Fc5K58qBux6F9vnYtgSuruCjDeWMjrvraSfIZF5DYak_QoUV45bWIkfisTP7VMcrzBDSjp6aVHQ1PEofkcGCpwh3A")' }}></div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <p className="text-foreground text-base font-bold leading-tight">David Wilson</p>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-500 border border-blue-100 uppercase">Groom</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="material-symbols-outlined text-sm text-muted-foreground">restaurant</span>
                <p className="text-muted-foreground text-xs font-normal">Party of 1 • Pending Info</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider">Pending</span>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-card dark:bg-muted/20 mx-2 my-1 rounded-xl px-4 min-h-[80px] py-3 justify-between shadow-sm border border-border">
          <div className="flex items-center gap-3 opacity-60">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 border-2 border-gray-200" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC6e6-Gmc0gobVfk5kNdMNbrwv7nDdeuO1LiuP8Zm3Xnh6l-Nw_5tTAOSjSfcVWYd8R4Zw3KZzLVCovXTlCgDuOvEzE6--a7UI73BWDsaUiEl0x86jfR5sB_-NwWpk4bqINkEGrYowGKSCZeE3vjesryNecGrDKSopJ992frmKsiGKDVzfr6Uf3VDMcyDwbKE9G23FRSfjBid3Knk5k1zx6fyRu3G91aPCncx0SMpxWT3mvvX2utOrDZ-BoUiy-a1OTQSmEIamYVdyk")' }}></div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <p className="text-foreground text-base font-bold leading-tight">Elena Rodriguez</p>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pink-50 text-pink-500 border border-pink-100 uppercase">Bride</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="material-symbols-outlined text-sm text-muted-foreground">close</span>
                <p className="text-muted-foreground text-xs font-normal">Cannot Attend</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="px-2 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider">Declined</span>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-card dark:bg-muted/20 mx-2 my-1 rounded-xl px-4 min-h-[80px] py-3 justify-between shadow-sm border border-border">
          <div className="flex items-center gap-3">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 border-2 border-primary/10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBzie1m7xVQWmZKZmqd8W0P27Gs_AuS94j1QdMt7wG7JhlptwyDbo18iMkR3YIGEeMZgUVpEB8i7GyYJSJjTQhMjJ6nnY3mG1eVOKsdFhtlSMPcv2zLyO9av2ykiIQcTbimc5b10z5yysHHvhVndxjFWdwlKz2WcwXrqxPEJSUj3jZGVWuKk5rpnWba8_cpOc8Z0m7dFeXkDNWADTC0HufA5EstKCc7GBEBfVzmF-7hHRPA9htI1mgix0Rv2FbjWvLjewSo2XCUpUz1")' }}></div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <p className="text-foreground text-base font-bold leading-tight">The Thompson Family</p>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-500 border border-blue-100 uppercase">Groom</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="material-symbols-outlined text-sm text-muted-foreground">restaurant</span>
                <p className="text-muted-foreground text-xs font-normal">Party of 4 • Mixed</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">Confirmed</span>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-card dark:bg-muted/20 mx-2 my-1 rounded-xl px-4 min-h-[80px] py-3 justify-between shadow-sm border border-border">
          <div className="flex items-center gap-3">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 border-2 border-primary/10" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCqBURV2o-AwlgTId5tRMwRZNXhGLMurX57Mg8lNy_44y-Qe90rZBMIs0qpkvq28CxiKq3Y9gZSp65g9umlaIvBEHvRCQCK6umGttJIcmRqmW4pNOI9sNboOlAWMHOe8BrmbVwdkqNbBRtxGlOR9umaAWK2wdXKbkW9N1TlLxeEPMWU5EtyRfQ_gBCwoTf1KG9nALYN7PIuhVcUl_HHzWUIb4C6nw2YiFqJEmeRgBDyg_DVBA5WPCIZQGnLwOO_Dm1dCZLY5yLen_Ci")' }}></div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <p className="text-foreground text-base font-bold leading-tight">Robert Chen</p>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pink-50 text-pink-500 border border-pink-100 uppercase">Bride</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="material-symbols-outlined text-sm text-muted-foreground">restaurant</span>
                <p className="text-muted-foreground text-xs font-normal">Party of 1 • Standard</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider">Pending</span>
          </div>
        </div>
      </div>
      <div className="fixed bottom-28 right-6 z-30">
        <button className="flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-lg active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>
    </div>
  );
}
