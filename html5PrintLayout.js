// JavaScript Document

$(document).ready(function(){
  var totalPage = 100;
  var headerSource   = $("#header-template").html();
  var headerTemplate = Handlebars.compile(headerSource);
  var headerContext = {};//{title: 1, body: "This is my header post!"};
  
  var footerSource   = $("#footer-template").html();
  var footerTemplate = Handlebars.compile(footerSource);
  var footerContext = {totalPage: totalPage, currentPage: 0};
  
  var contentSource   = $("#content-template").html();
  var contentTemplate = Handlebars.compile(contentSource);
  var contentContext = {};
  
  var contentTree = $.parseHTML(contentTemplate(contentContext));
  var currentPageIndex = 0;

  function createNewPage() {
    currentPageIndex += 1;
    var Page = document.createElement('div');
    Page.className = "page";
    Page.appendChild($.parseHTML(headerTemplate(headerContext))[1]);
    $("#document").append(Page);
    
    var PageWrapper = document.createElement('div');
    PageWrapper.className = "page-content-wrapper";
    PageWrapper.id = "page-content-wrapper-" + currentPageIndex;
    Page.appendChild(PageWrapper);
    
    var PageContent = document.createElement('div');
    PageContent.className = "page-content";
    PageContent.id = "page-content-" + currentPageIndex;
    PageWrapper.appendChild(PageContent);
	
	PageContent.appendChild(document.createElement('p'));

    return {Page: Page, PageWrapper: PageWrapper, PageContent: PageContent, PageIndex: currentPageIndex};
  }
  var PageNode = createNewPage();
  
  function GetMaximumHeight() {
	  return $("#page-content-wrapper-" + currentPageIndex).height();
  }
  
  function GetCurrentHeight() {
	  return $("#page-content-" + currentPageIndex).height();
  }
  
  function createNewTableWithHead(theadElement) {
	   var Table = document.createElement('table');
	   var Head = document.createElement('thead');
	   Table.appendChild(Head);
	   
	   var theadElementClone = theadElement.clone();
	   
	   for (var i = 0; i < theadElementClone[0].children.length ; i++) {
			Head.appendChild(theadElementClone[0].children[i]);
		}
	   
	   var Body = document.createElement('tbody');
	   Table.appendChild(Body);
	   return {Table: Table, Head: Head, Body: Body};
  }
  
  function layoutTheTable(tableObject) {
	  var currentTable;
	  PageNode.PageContent.appendChild(tableObject);
	  if (GetCurrentHeight() > GetMaximumHeight()) {
		  var tableToInsert = $("#page-content-" + currentPageIndex).children().last();
		  tableToInsert.remove();
		  
		  var theadElement = $(tableToInsert[0]).children('thead');
		  var tbodyElement = $(tableToInsert[0]).children('tbody');
		  
		  var currentTable = createNewTableWithHead(theadElement);
		  PageNode.PageContent.appendChild(currentTable.Table);
		  
		  if (GetCurrentHeight() > GetMaximumHeight()) {
			  $("#page-content-" + currentPageIndex).children().last().remove();
			  
			  PageNode = createNewPage();
			  currentTable = createNewTableWithHead(theadElement);
			  PageNode.PageContent.appendChild(currentTable.Table);
		  }
		  
		  for (var i = 0; i < tbodyElement[0].children.length ; i++) {
			  var rowToInsert = tbodyElement[0].children[i];
			  currentTable.Body.appendChild(rowToInsert);
			  if (GetCurrentHeight() > GetMaximumHeight()) {
				  $(currentTable.Body).children().last().remove();
				  
				  PageNode = createNewPage();
				  currentTable = createNewTableWithHead(theadElement);
				  PageNode.PageContent.appendChild(currentTable.Table);
				  currentTable.Body.appendChild(rowToInsert);
			  }
		  }
	  }
	  
	  
	  //var tableElement = $("#page-content-" + currentPageIndex).children().last();
	  //var theadElement = tableElement.find("thead");
	  //theadElement.remove();
//	  tableElement.remove();
//	  var thElement = tableElement.find( "th" );
//	  console.log(thElement);
  }
  
  for (var i = 1; i < contentTree.length; i++) {
  	var objectToInsert = contentTree[i];
	var objectToInsertTag = objectToInsert;
	if (objectToInsert.tagName == "P" || objectToInsert.tagName == "DIV") {
	  PageNode.PageContent.appendChild(objectToInsert);
	  if (GetCurrentHeight() > GetMaximumHeight()) {
		  $("#page-content-" + currentPageIndex).children().last().remove();
		  footerContext.currentPage = PageNode.PageIndex;
		  PageNode.Page.appendChild($.parseHTML(footerTemplate(footerContext))[1]);
		  PageNode = createNewPage();
		  PageNode.PageContent.appendChild(objectToInsert);
	  }
	}
	else if (objectToInsert.tagName == "TABLE") {
		layoutTheTable(objectToInsert);
	}
  }
  
});