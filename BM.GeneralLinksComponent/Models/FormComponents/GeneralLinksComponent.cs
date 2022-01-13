using BM.GeneralLinksComponent;
using CMS.Helpers;
using Kentico.Components.Web.Mvc.FormComponents;
using Kentico.Forms.Web.Mvc;
using Kentico.PageBuilder.Web.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

[assembly: RegisterFormComponent(GeneralLinksComponent.IDENTIFIER, typeof(GeneralLinksComponent), "General Links Component", IsAvailableInFormBuilderEditor = false)]
namespace BM.GeneralLinksComponent
{
    public class GeneralLinksComponent : FormComponent<GeneralLinksComponentProperties, IEnumerable<GeneralLink>>
    {
        public const string IDENTIFIER = "GeneralLinksComponent";

        private string _serializedValue = string.Empty;
        private IEnumerable<GeneralLink> _generalLinks = null;

        [BindableProperty]
        public string Value
        {
            get => _serializedValue;
            set
            {
                _generalLinks = null;
                _serializedValue = value;
            }
        }

        public int MaxLinks => Properties.MaxLinks;

        public string CustomCssClasses => Properties.CustomCssClasses;

        public string Tabs
        {
            get
            {
                List<string> list = new List<string>();
                foreach (ContentSelectorTabs value in Enum.GetValues(typeof(ContentSelectorTabs)))
                {
                    if (Properties.Tabs.HasFlag(value))
                    {
                        list.Add(value.ToStringRepresentation());
                    }
                }
                if (!list.Any())
                {
                    return null;
                }
                return JsonConvert.SerializeObject(list);
            }
        }

        public string DefaultTab
        {
            get
            {
                foreach (ContentSelectorTabs value in Enum.GetValues(typeof(ContentSelectorTabs)))
                {
                    if (Properties.DefaultTab == value)
                    {
                        return value.ToStringRepresentation();
                    }
                }
                return null;
            }
        }

        public string PageRootPath => Properties.PageRootPath;

        public string MediaLibraryName => Properties.MediaLibraryName;

        public string MediaAllowedExtensions => Properties.MediaAllowedExtensions;

        public string AttachmentAllowedExtensions => Properties.AttachmentAllowedExtensions;

        public override void BindContext(FormComponentContext context)
        {
            base.BindContext(context);
            if (!(context is PageBuilderFormComponentContext))
            {
                throw new NotSupportedException("The General Links Component is only available in page builder.");
            }
        }

        public override IEnumerable<GeneralLink> GetValue()
        {
            return _generalLinks ??
                (_generalLinks = !string.IsNullOrWhiteSpace(Value)
                    ? JsonConvert.DeserializeObject<IEnumerable<GeneralLink>>(Value)
                    : null);
        }

        public override void SetValue(IEnumerable<GeneralLink> value)
        {
            if (value != null)
            {
                Value = JsonConvert.SerializeObject(value);
            }
        }
    }
}
