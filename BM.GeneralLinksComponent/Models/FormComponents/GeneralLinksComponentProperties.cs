using CMS.DataEngine;
using Kentico.Components.Web.Mvc.FormComponents;
using Kentico.Forms.Web.Mvc;
using System.Collections.Generic;

namespace BM.GeneralLinksComponent.Models.FormComponents
{
    public class GeneralLinksComponentProperties : FormComponentProperties<IEnumerable<GeneralLink>>
    {
        [DefaultValueEditingComponent(GeneralLinksComponent.IDENTIFIER)]
        public override IEnumerable<GeneralLink> DefaultValue { get; set; }

        public int MaxLinks { get; set; } = 1;

        public string CustomCssClasses { get; set; }

        public ContentSelectorTabs Tabs { get; set; } = ContentSelectorTabs.Page;

        public ContentSelectorTabs DefaultTab { get; set; } = ContentSelectorTabs.Page;

        public string PageRootPath { get; set; } = "/";

        public string MediaLibraryName { get; set; }

        public string MediaAllowedExtensions { get; set; }

        public string AttachmentAllowedExtensions { get; set; }

        public GeneralLinksComponentProperties()
            : base(FieldDataType.Unknown)
        {
        }
    }
}
