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

    return {Page: Page, PageWrapper: PageWrapper, PageContent: PageContent, PageIndex: currentPageIndex};
  }

  var PageNode = createNewPage();
  
  var currentHeight = 0;
  for (i = 1; i < contentTree.length; i++) {
  	var elementToInsert = contentTree[i];
	var elementToInsertTag = elementToInsert;
	if (elementToInsert.tagName == "P" || elementToInsert.tagName == "DIV") {
	  PageNode.PageContent.appendChild(elementToInsert);
	  if ($("#page-content-" + currentPageIndex).height() > $("#page-content-wrapper-" + currentPageIndex).height()) {
		  $("#page-content-" + currentPageIndex).children().last().remove();
		  footerContext.currentPage = PageNode.PageIndex;
		  PageNode.Page.appendChild($.parseHTML(footerTemplate(footerContext))[1]);
		  PageNode = createNewPage();
		  PageNode.PageContent.appendChild(elementToInsert);
	  }
	}
//	else if (elementToInsert.tagName() = "table") {	
//	}
  }
  
});