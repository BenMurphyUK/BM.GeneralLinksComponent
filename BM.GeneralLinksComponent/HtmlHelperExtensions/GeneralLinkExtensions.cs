using BM.GeneralLinksComponent.Models;
using System;
using System.IO;
using System.Web;
using System.Web.Mvc;

namespace BM.GeneralLinksComponent.HtmlHelperExtensions
{
    public static class GeneralLinkExtensions
    {
        public static IHtmlString GeneralLink(this HtmlHelper htmlHelper, GeneralLink generalLink)
        {
            var generalLinkTagBuilder = GeneralLinkTagBuilder(GetGeneralLinkUrl(generalLink),
                generalLink.OpenInNewTab ? "_blank" : null,
                generalLink.CustomCssClasses, generalLink.LinkText);

            return MvcHtmlString.Create(generalLinkTagBuilder.ToString());
        }

        public static IDisposable BeginGeneralLink(this HtmlHelper htmlHelper, GeneralLink generalLink, string additionalCssClasses = null)
        {
            return new GeneralLinkDisposable(htmlHelper.ViewContext.Writer, generalLink, additionalCssClasses);
        }

        private class GeneralLinkDisposable : IDisposable
        {
            private readonly TextWriter _textWriter;

            public GeneralLinkDisposable(TextWriter textWriter, GeneralLink generalLink, string additionalCssClasses = null)
            {
                if (textWriter == null) throw new ArgumentNullException(nameof(textWriter));
                _textWriter = textWriter;

                var cssClasses = string.Empty;
                if (!string.IsNullOrWhiteSpace(generalLink.CustomCssClasses)) cssClasses += generalLink.CustomCssClasses;
                if (!string.IsNullOrWhiteSpace(additionalCssClasses)) cssClasses += $" {additionalCssClasses}";

                var generalLinkTagBuilder = GeneralLinkTagBuilder(GetGeneralLinkUrl(generalLink),
                    generalLink.OpenInNewTab ? "_blank" : null,
                    cssClasses, generalLink.LinkText);

                _textWriter.Write(generalLinkTagBuilder.ToString(TagRenderMode.StartTag));
            }

            public void Dispose()
            {
                _textWriter.Write("</a>");
            }
        }

        private static TagBuilder GeneralLinkTagBuilder(string url, string target = null, string cssClasses = null, string innerHtml = null)
        {
            var tagBuilder = new TagBuilder("a");
            tagBuilder.MergeAttribute("href", url);
            if (!string.IsNullOrWhiteSpace(target)) tagBuilder.MergeAttribute("target", target);
            if (!string.IsNullOrWhiteSpace(cssClasses)) tagBuilder.MergeAttribute("class", cssClasses);
            if (!string.IsNullOrWhiteSpace(innerHtml)) tagBuilder.InnerHtml = innerHtml;
            return tagBuilder;
        }

        private static string GetGeneralLinkUrl(GeneralLink generalLink)
        {
            return !string.IsNullOrWhiteSpace(generalLink.AnchorOrQueryString)
                && generalLink.LinkType != LinkType.AnchorOrQueryStringOnly
                    ? generalLink.Link.Url.ToString() + generalLink.AnchorOrQueryString
                    : generalLink.Link.Url.ToString();
        }
    }
}
