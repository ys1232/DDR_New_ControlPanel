function Edit_Dependency(id)
{
	var current_element = $("#"+id);
	var Tasks = current_element.prev().text();
	current_element.prev().hide();
	
	var Html_elements = 
	"<textarea class='form-control' rows='2' id='comment'>"+Tasks+"</textarea>"+
	"<button type='button' class='btn btn-default' onclick='Save_Dependency(this.id)'>Save</button>"+
	"<button type='button' class='btn btn-default' onclick='Cancle_Dependency(this.id)'>Cancle</button>";
	
	current_element.prepend(Html_elements);
	//current_element.hide();
	//alert(dependency_tasks);
}

function Save_Dependency(id)
{
	
	
}

function Cancle_Dependency(id)
{
	
	
}