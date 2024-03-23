const supabaseKey = 
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1waGViaXJ6eWRlb2dreWprdGpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2MDY2OTksImV4cCI6MjAyNjE4MjY5OX0.qDac2fiFpZVq-TOfqIDfj9osvHOWpCBb6VIVgypSiMM';

const supabaseUrl = 'https://mphebirzydeogkyjktjr.supabase.co';

const _supabase = supabase.createClient(supabaseUrl, supabaseKey);
console.log(_supabase);

const checkDB = async()=> {
    let goal = "";
    const {data, error} = await _supabase.from("Goals").select("*");
    if (data){
        //https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore
        for (var i in data){
            goal += `<a href="timeline.html" style="color: black !important; ">
            <div class="card card-style" style="width: 18rem; height: 10rem; display: inline-block; ">
                <div class="card-body">
                     <h5 class="card-title">${data[i].goal_name}</h5>
                     <h6 class="card-subtitle mb-2 text-muted">${data[i].description}</h6>
                     <div class="progress">
                         <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                     </div>
                 </div>
             </div>
         </a>`
        };
        const template = document.createElement("a");
        template.innerHTML = goal.trim();
        let sibling = document.getElementById("goal1");
        let parent = sibling.parentNode;
        parent.insertBefore(template, sibling.nextSibling);   
    }
    else{
        console.log(error);
    };

};

checkDB();