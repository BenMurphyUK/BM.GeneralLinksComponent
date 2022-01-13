# 🔗 Kentico Xperience 13 MVC General Links Form Component

This is a tool for Kentico Xperience 13 MVC (not Core, yet!) that provides a custom form component ready to use in widget properties dialogs where content editors can add a general link and control it's attributes, such as CSS classes and target.

![enter image description here](https://raw.githubusercontent.com/BenMurphyUK/BM.GeneralLinksComponent/master/assets/widgetproperties.png)

![enter image description here](https://raw.githubusercontent.com/BenMurphyUK/BM.GeneralLinksComponent/master/assets/modaldialog.png)

## 🧩 Compatibility

Can be used with Kentico Xperience sites that use version 13.0.52 and higher, and are using the .NET 5 MVC development model.

## ➕ Installation

Using NuGet package manager console: 

    Install-Package BM.GeneralLinksComponent

## ⚙️ Setup & Usage

In your widget properties class, you can use the following configurable properties:

    using BM.GeneralLinksComponent;
    
    [EditingComponent(GeneralLinksComponent.IDENTIFIER, Order = 3, Label = "Links")]
    [EditingComponentProperty(nameof(GeneralLinksComponent.MaxLinks), 2)]
    [EditingComponentProperty(nameof(GeneralLinksComponent.CustomCssClasses), "button button--primary;Primary Button\r\nbutton button--secondary;Secondary Button")]
    [EditingComponentProperty(nameof(GeneralLinksComponent.Tabs), ContentSelectorTabs.Page | ContentSelectorTabs.Media | ContentSelectorTabs.Attachment)]
    [EditingComponentProperty(nameof(GeneralLinksComponent.DefaultTab), ContentSelectorTabs.Page)]
    [EditingComponentProperty(nameof(GeneralLinksComponent.PageRootPath), "/")]
    [EditingComponentProperty(nameof(GeneralLinksComponent.MediaLibraryName), "CDE")]
    [EditingComponentProperty(nameof(GeneralLinksComponent.MediaAllowedExtensions), ".gif;.png;.jpg;.jpeg;.pdf")]
    [EditingComponentProperty(nameof(GeneralLinksComponent.AttachmentAllowedExtensions), ".gif;.png;.jpg;.jpeg;.pdf")]
    public IEnumerable<GeneralLink> Links { get; set; }

You can also use the following HTML helper extension methods in your views:

    @using BM.GeneralLinksComponent.HtmlHelperExtensions    

    @foreach (var generalLink in Model.Links)
    {
        <div>
            @Html.GeneralLink(generalLink)
        </div>

        <div>
            @using (Html.BeginGeneralLink(generalLink, "additional-css-class"))
            {
                <img src="/sample.png" alt="Sample image">
            }
        </div>
    }

You can **reorder** the links by dragging and dropping them to the desired order in the widget properties dialog. 

## ⌨️ Contributions, 🐛 Bug Fixes, and📜 License

Feel free to Fork and submit pull requests to contribute.

You can submit bugs through the issue list and we will get to them as soon as we can, unless you want to fix it yourself and submit a pull request!

Check the LICENSE.txt for License information

## 🙏 Acknowledgements

This add on has been built with the invaluable help of:

 - [Trevor Fayas](https://github.com/KenticoDevTrev) - for an excellent boilerplate for shareable components
 - [Sean G Wright](https://github.com/seangwright) - for providing lots of amazing help and always willing to answer my (probably annoying!) Kentico dev questions
 - The Kentico support team (particularly [Jakub Skurek](https://github.com/skurekjakub)) - for always speedily responding with helpful info and the amazing documentation