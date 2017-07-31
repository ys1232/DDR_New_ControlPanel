var XML_Path = "C:\\Users\\Hui\\Desktop\\DDR_New_ControlPanel-master\\DDR_ControlPanel\\DD_Hierachy_Config_test.xml";
window.onload = Xml_Reading;
var Task_enabled_array = {};
var Task_dependency_arry = {};
var Task_ID_Name_Dict = {};
var Task_Name_ID_Dict = {};

var Lkup_Dict = new Map(); //'T_',
Lkup_Dict.set('ContainerC_1', ['T_1','T_2']);
Lkup_Dict.set('ContainerC_2', ['T_3']);
Lkup_Dict.set('ContainerC_3', ['T_4','T_5','T_6','T_7','T_8','T_9']);
Lkup_Dict.set('ContainerC_4', ['T_10','T_11','T_12','T_13']);
Lkup_Dict.set('ContainerC_5', ['T_14','T_15','T_16']);
Lkup_Dict.set('ContainerC_6', ['T_17','T_18','T_19','T_20']);
Lkup_Dict.set('ContainerC_7', ['T_21','T_22']);
Lkup_Dict.set('ContainerC_8', ['T_23','T_24','T_25','T_26','T_27','T_28','T_29','T_30','T_31','T_32','T_33','T_34','T_35','T_36','T_37','T_38','T_39','T_40','T_41','T_42','T_43','T_44','T_45','T_46','T_47','T_48']);
Lkup_Dict.set('ContainerC_9', ['T_49','T_50','T_51','T_52','T_53','T_54']);
Lkup_Dict.set('ContainerC_10', ['T_55']);
Lkup_Dict.set('ContainerC_11', ['T_57']);
Lkup_Dict.set('ContainerC_12', ['T_59']);
Lkup_Dict.set('ContainerC_13', ['T_60','T_61','T_62','T_63','T_64','T_65','T_66']);
Lkup_Dict.set('ContainerC_14', ['T_60','T_61','T_62']);
Lkup_Dict.set('ContainerC_15', ['T_63','T_64','T_65','T_66']);
Lkup_Dict.set('ContainerC_16', ['T_68','T_69','T_70']);
Lkup_Dict.set('ContainerC_17', ['T_71','T_72','T_73']);

var XmlChanged = "F";
setInterval(Check, 3000);

function Check() {

	if (XmlChanged == "T")
	{
		XmlChanged = "F";
		Save_XML_Change();
	}
}

function Xml_Reading() 
{
    //alert("yes!");
	var parser, xmlDoc;
	var XML_Text = readTextFile(XML_Path);

	var Whole_menu = "<div class='container'>";
	var final_container_block_html;
	
	$(XML_Text).find("Container").each
	(function(){
		final_container_block_html = "";
		
		var _container_id = $(this).attr("container_id");
		var _container_name =  $(this).attr("name");
		var _container_enabled = $(this).attr("enabled");
		final_container_block_html = Container_Builder(_container_id, _container_name, _container_enabled);  // return piece one of the html string
		
		$(this).find("Task").each
		(function(){
			var Task_Name = $(this).attr("name");
			var Task_id = $(this).attr("Task_id");
			var Enabled = $(this).attr("enabled");
			var Dependency = $(this).attr("task_dependency");
			
			Task_ID_Name_Dict[Task_id.trim()] = Task_Name.trim();
			Task_Name_ID_Dict[Task_Name.trim()] = Task_id.trim();
			
			//alert("Call task builder:" + Task_id + " " + Task_Name + "  " + Dependency);
			final_container_block_html = final_container_block_html + Task_Builder(Task_id,Task_Name,Enabled,Dependency);  // get the string piece for each task
		});	
		final_container_block_html = final_container_block_html + "</div>"
		Whole_menu = Whole_menu + final_container_block_html;	
	});
	
	Whole_menu = Whole_menu + "</div>"
	
	$('#setting_menu').append(Whole_menu);
	
	//alert(XML_Text);
	
	/**
	parser = new DOMParser();
	xmlDoc = parser.parseFromString(XML_Text,"text/xml");

	var Tasks_Nodes_array = xmlDoc.getElementsByTagName("Task");

	for (var i = 0; i<Tasks_Nodes_array.length; i++)
	{
		Task_enabled_array[Tasks_Nodes_array[i].getAttribute("Task_id")] = Tasks_Nodes_array[i].getAttribute("enabled");
	}	
	SetOpacity();
**/
}

function Task_Builder(Task_ID,Task_Name,Enabled,Dependency)
{		//<div class = "Task_Item" id = "T_1" ><span class = "Task_Name_Span" onclick="Disable_Task(this)">Get_Postgres_Time</span>
		var opacity_status;
		if (Enabled == "F")
			opacity_status = "style='opacity:0.3;'";
		else if (Enabled == "T")
			opacity_status = "style='opacity:1;'";
		
		
		var Task_ID_array = Dependency.split(",");
		var arrayLength = Task_ID_array.length;
		
		var Task_Names_str = "";
		if (Task_ID_array[0].trim() != "")
		{
			for (var i = 0; i < arrayLength; i++) 
			{
				Task_Names_str = Task_Names_str + ", " + Task_ID_Name_Dict[Task_ID_array[i].trim()];
				//alert("Dependency is:" + Dependency + " "+Task_ID_array[i].trim() + "   " +  Task_ID_Name_Dict[Task_ID_array[i].trim()] );
			}

			Task_Names_str = Task_Names_str.substring(2,Task_Names_str.length);	
		}
		
		var Dependency_List = "";
		return "<div class = 'Task_Item' id = '" + Task_ID + "' " + opacity_status + " ><span class = 'Task_Name_Span' onclick='Disable_Task(this)'>" + Task_Name + "</span>"+
		"<button type='button' class='btn btn-default show_dependency_btn' onclick='Change_Dependency_Button_Text(this)' href='#" + Task_ID + "_Dependency" + "' data-toggle='collapse'>Show Dependency</button>"+
		"</div>"+
		"<div class='collapse panel panel-default' id = '" + Task_ID + "_Dependency" + "'>"+
		"<div class='panel-body dependency_text dependency_display'>" + Task_Names_str + "</div>"+
		"<button type='button' class='btn btn-default dependency_display' onclick='Edit_Dependency(this)'>Edit</button>"+
		"</div>";	
}

function Edit_Dependency(_this)
{						
	var current_element = $(_this);
	var Task_dependency = current_element.siblings('.dependency_text').text();
	var Edit_Html = "<textarea class='form-control edit_element' rows='2'>" + Task_dependency + "</textarea>"+
	"<button type='button'  class='btn btn-default edit_element' onclick='Save_Dependency(this)'>Save</button>"+
	"<button type='button'  class='btn btn-default edit_element' onclick='Cancle_Dependency(this)'>Cancle</button>";
	current_element.parent().append(Edit_Html);
	current_element.parent().children('.dependency_display').hide();  // if you use sibling(), current_element won't be selected
}


// this won't work properly for inner container
function Container_Builder(container_id, container_name, container_enabled)
{	
	return  "<div class = 'Container_Item'> <span href='#"+container_id+"' class = 'collapse_btn' data-toggle='collapse'><<</span> <span id = '" + "Container" + container_id + "' class = 'Container_name_span' onclick='Disable_Container(this.id)'>" + container_name +"</span></div>"+
	"<div id = '" + container_id + "' class = 'collapse'>"
	//alert(container_id);
}

function readTextFile(file)
{
	var fso, f1,s;
	fso = new ActiveXObject("Scripting.FileSystemObject");
	f1 = fso.OpenTextFile(file, 1);
	s = f1.Readall();
	return s;
}

function Change_Dependency_Button_Text(_this)
{
	var button_text = $(_this).html();
	if(button_text == "Show Dependency")
		$(_this).html("Hide Dependency");
	else if(button_text == "Hide Dependency")
		$(_this).html('Show Dependency');
}

function Cancle_Dependency(_this)
{
	var current_element = $(_this);
	current_element.siblings().show();
	current_element.parent().children('.edit_element').remove();
}

function Save_Dependency(_this)
{
	XmlChanged = "T";
	var current_element = $(_this);
	var Dependency_text = current_element.siblings('textarea').val();
	current_element.siblings('.dependency_text').text(Dependency_text);
	
	//alert("Parent class:"+current_element.parent().attr('class'));
	//alert("Parent siblings class:"+current_element.parent().siblings(".Task_Item").attr('class'));
	
	var Task_ID = current_element.parent().siblings(".Task_Item").attr('id');
	alert("Task_ID:"+Task_ID);
	
	var Task_Name_array = Dependency_text.split(",");
	var arrayLength = Task_Name_array.length;
		
	var Task_ID_str = "";
	if (Task_Name_array[0].trim() != "")
	{
		for (var i = 0; i < arrayLength; i++) 
		{
			Task_ID_str = Task_ID_str + ", " + Task_Name_ID_Dict[Task_Name_array[i].trim()];
		}

		Task_ID_str = Task_ID_str.substring(2,Task_ID_str.length);	
	}
		
	Task_dependency_arry[Task_ID] = Task_ID_str;
	
	Cancle_Dependency(_this);
	alert(Task_ID + " " + Task_ID_str);
}

function Disable_Task(_this)
{
	XmlChanged = "T";
	var target_element = $(_this).parent();
	var current_opacity = target_element.css("opacity");

	if (current_opacity == "0.3")
	{
		target_element.css("opacity","1");
		Task_enabled_array[target_element.attr('id')] = "T";
	}		
	else
	{
		target_element.css("opacity","0.3");
		Task_enabled_array[target_element.attr('id')] = "F";
	}		
}



function Save_XML_Change()	
{

	var XML_Text = readTextFile(XML_Path);
	var xml = $.parseXML(XML_Text);

	$xml = $(xml);
	
	// set enable attribute
	if (Task_enabled_array.length != undefined)
	{
		for(key in Task_enabled_array)
		{
			$xml.find("Task[Task_id='" + key + "']").each
			(
				function(){ 
				$(this).attr("enabled",Task_enabled_array[key]);
				}
			);		  
		}		
	}
	
	
	// set dependency attribute
	if (Task_dependency_arry.length != undefined)
	{
		for(key in Task_dependency_arry)
		{
			$xml.find("Task[Task_id='" + key + "']").each
			(
				function(){ 
				$(this).attr("task_dependency",Task_dependency_arry[key]);
				}
			);		  
		}
	}
	
	
	
	//alert(xmlToString($xml))

	var fso = new ActiveXObject("Scripting.FileSystemObject");
		
	if(fso.FileExists(XML_Path))
	{
		//alert("file exists");
		fso.CreateTextFile(XML_Path,true);	// overwrite existing file
	}
	
	var a, ForAppending, file;
	ForAppending = 8;
	file = fso.OpenTextFile(XML_Path, ForAppending, false);
	file.Write(xmlToString($xml));

}

function xmlToString(xmlData) { 

    var xmlString = undefined;

    if (window.ActiveXObject){
        xmlString = xmlData[0].xml;
    }

    if (xmlString === undefined)
    {
        var oSerializer = new XMLSerializer();
        xmlString = oSerializer.serializeToString(xmlData[0]);
    }

    return xmlString;
}

function Disable_Container(_id)
{
	XmlChanged = "T";
	var current_element = $("#"+_id);
	var Tasks = Lkup_Dict.get(_id);
	var Task_previous_state = "";  
	
	var i = 0;
	
	Tasks.forEach(function(task)
	{
		var current_task = $("#"+task);
		if (Task_previous_state == "")
		{			
			Task_previous_state = current_task.css('opacity');
		}	

			if (Task_previous_state == "1")
			{	
				current_task.css('opacity','0.3');	
				Task_enabled_array[task] = "F";
			}
			else if (Task_previous_state == "0.3")
			{	
				current_task.css('opacity','1');
				Task_enabled_array[task] = "T";
			}			
		
		i++;
	});	
	
}