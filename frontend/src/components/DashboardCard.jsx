export default function DashboardCard({
title,
value,
icon,
color
}){

const Icon=icon;

return(

<div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">

<div>

<p className="text-gray-500">

{title}

</p>

<h1 className="text-3xl font-bold mt-2">

{value}

</h1>

</div>

<div className={`${color} p-4 rounded-xl text-white`}>

<Icon size={28}/>

</div>

</div>

)

}