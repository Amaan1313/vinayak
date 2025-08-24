'use client';
import { Calculator, ShieldCheck, Zap, Phone, CheckCircle2, BadgeIndianRupee, Building2, Users, MessageCircle } from 'lucide-react';
import { useMemo, useState } from 'react';import Link from 'next/link';import { useRouter } from 'next/navigation';
import { clamp, formatINR, Input, Select, RangeInput, StatCard, FAQ, useEMI, validIndianMobile } from '@/components/ui';
export default function Page(){
 const [amount,setAmount]=useState(1000000);const [rate,setRate]=useState(11.5);const [tenure,setTenure]=useState(60);
 const { emi,totalInterest,totalPayable }=useEMI(amount,rate,tenure);
 const [income,setIncome]=useState(60000);const [obligations,setObligations]=useState(5000);
 const foir=useMemo(()=>{const net=Math.max((Number(income)||0)-(Number(obligations)||0),0);return{net,maxEmi:0.45*net}},[income,obligations]);
 const [form,setForm]=useState({name:'',phone:'',city:'',email:'',loanType:'Home Loan',amount:''});
 const [consent,setConsent]=useState(true);const [submitted,setSubmitted]=useState(false);const [errors,setErrors]=useState<any>({});const router=useRouter();
 const onSubmit=async(e:React.FormEvent)=>{e.preventDefault();const errs:any={};if(!form.name.trim())errs.name='Please enter your name';if(!validIndianMobile(form.phone))errs.phone='Enter a valid Indian mobile number';if(!consent)errs.consent='Please agree to be contacted';setErrors(errs);if(Object.keys(errs).length===0){try{await fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,amount:form.amount||amount})});}catch{}setSubmitted(true);router.push(`/thank-you?name=${encodeURIComponent(form.name.split(' ')[0]||'Applicant')}`);}}
 const waLink=`https://wa.me/919999999999?text=${encodeURIComponent('Hi Vinayak Finserv, I want to apply for a '+form.loanType+' of ₹'+formatINR(Number(form.amount||amount))+'.')}`;
 return(<main>
  <header className='sticky top-0 z-40 backdrop-blur bg-neutral-950/70 border-b border-white/5'><div className='container py-3 flex items-center justify-between'><div className='flex items-center gap-2'><BadgeIndianRupee className='w-6 h-6 text-amber-400'/><span className='font-semibold tracking-wide'>Vinayak Finserv</span></div><a href='#apply' className='btn btn-primary'>Apply Now</a></div></header>
  <section className='relative overflow-hidden'><div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.12),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.12),transparent_40%)]'/>
    <div className='container py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center'>
      <div><h1 className='text-4xl lg:text-6xl font-black leading-tight'>Fast, Transparent <span className='text-amber-400'>Loans</span> with <span className='text-blue-400'>140+ Lenders</span></h1>
      <p className='mt-4 text-neutral-300 text-lg max-w-xl'>Instant eligibility check, best-rate matching, and doorstep documentation. Your one-stop DSA for Home, Business & Personal Loans.</p>
      <ul className='mt-6 space-y-2 text-neutral-300'><li className='flex items-center gap-2'><ShieldCheck className='w-5 h-5 text-emerald-400'/>RBI/KYC compliant process</li><li className='flex items-center gap-2'><Users className='w-5 h-5 text-blue-400'/>Dedicated relationship manager</li><li className='flex items-center gap-2'><Building2 className='w-5 h-5 text-amber-400'/>Ties with top banks & NBFCs</li></ul>
      <div className='mt-8 flex gap-3'><a href='#calculator' className='btn bg-white text-neutral-900'>Calculate EMI</a><a href={waLink} target='_blank' className='btn btn-ghost'><MessageCircle className='w-4 h-4'/>WhatsApp Us</a></div></div>
      <div id='apply' className='card p-6 shadow-xl'>{!submitted?(<form onSubmit={onSubmit} className='grid grid-cols-1 gap-4'>
        <h3 className='text-xl font-semibold'>Get a Free Eligibility Check</h3>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          <Input label='Full Name' placeholder='Aman Dhillon' value={form.name} onChange={(v)=>setForm({...form,name:v})}/>
          <Input label='Mobile Number' placeholder='98XXXXXXXX' value={form.phone} onChange={(v)=>setForm({...form,phone:v})} />
          <Input label='City' placeholder='Ludhiana' value={form.city} onChange={(v)=>setForm({...form,city:v})}/>
          <Input label='Email (optional)' placeholder='you@email.com' value={form.email} onChange={(v)=>setForm({...form,email:v})}/>
          <Select label='Loan Type' value={form.loanType} onChange={(v)=>setForm({...form,loanType:v})} options={['Home Loan','Business Loan','Personal Loan','LAP','Auto Loan']}/>
          <Input label='Loan Amount (₹)' placeholder='1000000' value={form.amount} onChange={(v)=>setForm({...form,amount:String(v).replace(/\D/g,'')})}/>
        </div>
        <label className='flex items-start gap-2 text-sm mt-2'><input type='checkbox' checked={consent} onChange={(e)=>setConsent(e.target.checked)} className='mt-1'/><span>I agree to be contacted by phone/WhatsApp & email regarding my application.</span></label>
        {errors.consent && <p className='text-rose-400 text-sm'>{errors.consent}</p>}
        <button className='btn btn-primary mt-2'>Request Callback</button>
        <p className='text-xs text-neutral-400'>By continuing, you consent to data processing as per our Privacy Policy. We never share your data without consent.</p>
      </form>):(<div className='text-center py-8'><CheckCircle2 className='w-14 h-14 text-emerald-400 mx-auto'/><h3 className='text-2xl font-bold mt-3'>Thank you!</h3><p className='text-neutral-300 mt-2'>Redirecting to confirmation…</p></div>)}</div>
    </div></section>
  <section id='calculator' className='border-t border-white/5'><div className='container py-14 grid lg:grid-cols-3 gap-8'><div className='lg:col-span-2'>
    <h2 className='text-3xl font-bold flex items-center gap-3'><Calculator className='w-7 h-7 text-amber-400'/> Loan EMI Calculator</h2>
    <div className='mt-6 card p-6'><RangeInput label={`Loan Amount (₹${formatINR(amount)})`} min={50000} max={20000000} step={50000} value={amount} onChange={setAmount}/>
    <RangeInput label={`Interest Rate (${rate}% p.a.)`} min={6} max={24} step={0.1} value={rate} onChange={setRate}/>
    <RangeInput label={`Tenure (${tenure} months)`} min={6} max={360} step={1} value={tenure} onChange={setTenure}/>
    <div className='grid sm:grid-cols-3 gap-4 mt-6'><StatCard label='Monthly EMI' value={`₹${formatINR(Math.round(emi))}`}/><StatCard label='Total Interest' value={`₹${formatINR(Math.round(totalInterest))}`}/><StatCard label='Total Payable' value={`₹${formatINR(Math.round(totalPayable))}`}/></div></div></div>
    <div className='lg:col-span-1'><h3 className='text-xl font-bold'>Quick Eligibility (FOIR)</h3><div className='mt-4 card p-6'>
      <Input label='Monthly Income (₹)' value={income} onChange={(v)=>setIncome(Number(String(v).replace(/\D/g,'')))} placeholder='60000'/>
      <Input label='Monthly Obligations (₹)' value={obligations} onChange={(v)=>setObligations(Number(String(v).replace(/\D/g,'')))} placeholder='5000'/>
      <div className='grid grid-cols-2 gap-3 mt-4'><StatCard label='Net Disposable' value={`₹${formatINR(foir.net)}`}/><StatCard label='Max Eligible EMI (45%)' value={`₹${formatINR(Math.round(foir.maxEmi))}`}/></div>
      <p className='text-xs text-neutral-400 mt-3'>*Indicative only. Final eligibility depends on lender policy, income docs, bureau score, LTV, etc.</p></div></div>
  </div></section>
  <section className='border-t border-white/5'><div className='container py-14'><h2 className='text-3xl font-bold'>Why Choose Us</h2>
    <div className='mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-5'>
      <Feat title='Compliance First' desc='RBI/KYC compliant process & secure data handling.'/><Feat title='Fast Approvals' desc='Instant checks, doorstep pickup, quick disbursals.'/><Feat title='140+ Lenders' desc='Banks & NBFCs to match best rates & offers.'/><Feat title='Human Support' desc='A dedicated RM to guide you end‑to‑end.'/>
    </div></div></section>
  <section className='border-t border-white/5'><div className='container py-14 max-w-5xl'><h2 className='text-3xl font-bold'>FAQs</h2>
    <div className='mt-6 space-y-4'><FAQ q='Which loans can I apply for?' a='Home, Business, Personal, LAP and Auto loans. We match you with lenders based on profile & documents.'/><FAQ q='How long does approval take?' a='Preliminary eligibility is instant. Sanction/disbursal timelines vary by lender and documentation.'/><FAQ q='Is my data safe?' a='Yes. We follow encryption & minimal data collection. Data is never sold and is used only to process your application.'/></div></div></section>
  <footer className='border-t border-white/5'><div className='container py-10 text-sm text-neutral-400 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'><p>© {new Date().getFullYear()} Vinayak Finserv. All rights reserved.</p><p>Disclaimer: Vinayak Finserv acts as a DSA/Channel Partner. Offers subject to lender terms. We do not solicit upfront payments.</p></div></footer>
 </main>);}
function Feat({title,desc}:{title:string;desc:string;}){return(<div className='rounded-2xl p-5 border border-white/10 bg-gradient-to-br from-white/5 to-transparent'><div className='text-amber-400'>★</div><h3 className='mt-3 font-semibold'>{title}</h3><p className='text-sm text-neutral-300 mt-1'>{desc}</p></div>)}